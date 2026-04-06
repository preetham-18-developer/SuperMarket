import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import redis from './config/redis.js';
import logger from './utils/logger.js';
import ApiError from './utils/ApiError.js';
import { orderQueue } from './queues/orderQueue.js'; // BullMQ for background tasks

dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 4000;

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// ── SECURITY & MIDDLEWARE ───────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());

// ── RATE LIMITING (PHASE 1) ──
// Use Redis to store rate limits for distributed scalability
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again after 15 minutes' },
  // store: new RedisStore({ client: redis }) // Future improvement: use redis store
});

app.use('/api/', limiter);

// ── STRUCTURED LOGGING (PHASE 1) ──
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// ── MULTI-TENANCY CONTEXT (PHASE 4) ──
// Middleware to ensure every request identifies the store
const injectStoreContext = (req: any, res: Response, next: NextFunction) => {
  req.storeId = req.headers['x-store-id'] || 'gravity-main'; // Fallback to main store
  next();
};

app.use(injectStoreContext);

// ── ROUTES ───────────────────────────────────────────────────────────────────

// HEALTH CHECK (PHASE 5)
app.get('/health', async (req, res) => {
  const dbHealth = await supabase.from('stores').select('id').limit(1);
  const redisHealth = await redis.ping();
  res.json({
    status: 'healthy',
    database: dbHealth.error ? 'disconnected' : 'connected',
    cache: redisHealth === 'PONG' ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// PRODUCTS API with REDIS CACHING (PHASE 2)
app.get('/api/products', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { category, query, page = '1' } = req.query;
    const cacheKey = `products:${req.storeId}:${category || 'all'}:${query || 'none'}:p${page}`;

    // 1. Try Cache First
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      logger.info('CACHE_HIT: Returning cached products');
      return res.json(JSON.parse(cachedData));
    }

    // 2. Fallback to DB
    logger.info('CACHE_MISS: Fetching from Supabase');
    let dbQuery = supabase
      .from('products')
      .select('*, categories(*)', { count: 'exact' })
      .eq('status', 'active')
      .eq('store_id', req.storeId); // MULTI-TENANCY SCOPING

    if (category && category !== 'all') dbQuery = dbQuery.eq('category_id', category);
    if (query) dbQuery = dbQuery.textSearch('fts', String(query));

    const offset = (Number(page) - 1) * 20;
    const { data, error, count } = await dbQuery
      .order('is_featured', { ascending: false })
      .range(offset, offset + 19);

    if (error) throw new ApiError(500, error.message);

    const response = {
      data,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil((count || 0) / 20),
        currentPage: Number(page)
      }
    };

    // 3. Set Cache for 120s (TTL)
    await redis.setex(cacheKey, 120, JSON.stringify(response));

    res.json(response);
  } catch (err) {
    next(err);
  }
});

// ORDERS API with IDEMPOTENCY & BACKGROUND BULLMQ (PHASE 1, 2)
app.post('/api/orders', async (req: any, res: Response, next: NextFunction) => {
  const { userData, cart, address, phone, idempotencyKey } = req.body;

  if (!idempotencyKey) return next(new ApiError(400, 'Idempotency-Key is required for order creation'));

  try {
    // ── IDEMPOTENCY CHECK ──
    const existingOrder = await supabase
      .from('idempotency_keys')
      .select('*')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (existingOrder.data) {
      logger.warn(`REPEATED_REQUEST: Idempotency-Key ${idempotencyKey} hit. Returning cached response.`);
      return res.status(existingOrder.data.http_status).json(existingOrder.data.response_body);
    }

    // Atomic stock check and order processing (via existing SQL RPC)
    const { data: result, error: rpcError } = await supabase.rpc('process_order_inventory', {
      items_to_check: cart.map((i: any) => ({ product_id: i.id, req_qty: i.quantity })),
      p_store_id: req.storeId // Assuming rpc updated for store scoping
    });

    if (rpcError || !result.success) throw new ApiError(400, 'Inventory mismatch or failure');

    // ── CREATE ORDER ──
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userData?.id || null,
        store_id: req.storeId,
        status: 'pending',
        total_amount: cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0),
        address,
        phone,
        payment_status: 'pending'
      })
      .select().single();

    if (orderError) throw orderError;

    const responseBody = { success: true, orderId: orderData.id, orderNumber: `SM-${orderData.id.slice(0, 8).toUpperCase()}` };

    // ── CACHE IDEMPOTENCY KEY ──
    await supabase.from('idempotency_keys').insert({
      idempotency_key: idempotencyKey,
      response_body: responseBody,
      http_status: 201
    });

    // ── OFFLOAD ASYNC TASKS TO BULLMQ (PHASE 2) ──
    await orderQueue.add('ORDER_POST_PROCESSING', {
      type: 'ORDER_EMAIL_CONFIRMATION',
      data: { orderId: orderData.id, email: userData.email, phone }
    });

    res.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
});

// ── GLOBAL ERROR HANDLER (PHASE 1) ───────────────────────────────────────────
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error (Ref: ' + Date.now() + ')';
  
  logger.error('API_EXCEPTION:', {
    status: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : 'REDACTED',
    path: req.path
  });

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(port, () => {
  logger.info(`SERVER_STARTUP: SaaS Backend Operational on http://localhost:${port}`);
});
