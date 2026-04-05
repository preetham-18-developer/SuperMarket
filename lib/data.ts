// Anti Gravity — Core Data Layer
// All entities: products, categories, brands, orders, analytics

export type Unit = 'kg' | 'g' | 'L' | 'ml' | 'pack' | 'piece' | 'dozen';
export type ProductStatus = 'active' | 'draft' | 'inactive' | 'discontinued';
export type OrderStatus =
  | 'draft' | 'pending_payment' | 'confirmed' | 'packed' | 'processing'
  | 'out_for_delivery' | 'delivered' | 'cancelled' | 'failed'
  | 'returned' | 'refunded' | 'partially_refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded' | 'cod';
export type PaymentMethod = 'razorpay' | 'cod' | 'upi' | 'card' | 'netbanking';
export type InventoryHealth = 'healthy' | 'low' | 'critical' | 'out_of_stock';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount: number;
  color: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  brandId: string;
  category: string;
  categoryId: string;
  subcategory: string;
  description: string;
  shortDescription: string;
  weight: number;
  unit: Unit;
  mrp: number;
  price: number;
  discountPercent: number;
  taxClass: string;
  stock: number;
  reorderThreshold: number;
  lowStockThreshold: number;
  outOfStock: boolean;
  expiryDate?: string;
  perishable: boolean;
  imageUrl: string;
  gallery: string[];
  status: ProductStatus;
  featured: boolean;
  bestSeller: boolean;
  rating: number;
  reviewCount: number;
  unitsSold: number;
  isNew?: boolean;
  // For cart compatibility
  made_by?: string;
  image_url?: string;
  discount_percent?: number;
  category_id?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  totalAmount: number; // Alias for UI
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  address: Address;
  shippingAddress: Address; // Alias for UI
  deliverySlot: string;
  notes?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  product_name?: string; // Alias for UI
  sku: string;
  imageUrl: string;
  quantity: number;
  mrp: number;
  price: number;
  total: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  expiresAt: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  revenueGrowth: number;
  ordersToday: number;
  ordersTodayGrowth: number;
  salesToday: number;
  unitsSoldToday: number;
  avgOrderValue: number;
  aovGrowth: number;
  activeCustomers: number;
  refundTotal: number;
  lowStockCount: number;
  outOfStockCount: number;
}

// ─── CATEGORIES ─────────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  { id: 'fruits-vegetables', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', icon: '🥦', description: 'Farm-fresh produce', productCount: 48, color: '#4CAF50' },
  { id: 'dairy-bakery', name: 'Dairy & Bakery', slug: 'dairy-bakery', icon: '🧀', description: 'Milk, cheese, breads & more', productCount: 35, color: '#FFC107' },
  { id: 'snacks', name: 'Snacks & Munchies', slug: 'snacks', icon: '🍿', description: 'Chips, biscuits, namkeen', productCount: 62, color: '#FF5722' },
  { id: 'beverages', name: 'Beverages', slug: 'beverages', icon: '☕', description: 'Juices, tea, coffee & drinks', productCount: 40, color: '#9C27B0' },
  { id: 'household', name: 'Household', slug: 'household', icon: '🧹', description: 'Cleaning & home essentials', productCount: 29, color: '#2196F3' },
  { id: 'personal-care', name: 'Personal Care', slug: 'personal-care', icon: '🧴', description: 'Skincare, hair & hygiene', productCount: 44, color: '#E91E63' },
  { id: 'staples', name: 'Staples & Grains', slug: 'staples', icon: '🌾', description: 'Rice, dal, atta & oils', productCount: 38, color: '#FF9800' },
  { id: 'frozen', name: 'Frozen Foods', slug: 'frozen', icon: '🧊', description: 'Ice cream, frozen meals', productCount: 22, color: '#00BCD4' },
  { id: 'baby-care', name: 'Baby Care', slug: 'baby-care', icon: '👶', description: 'Diapers, formula & toys', productCount: 18, color: '#8BC34A' },
  { id: 'meat-seafood', name: 'Meat & Seafood', slug: 'meat-seafood', icon: '🐟', description: 'Fresh & frozen non-veg', productCount: 25, color: '#F44336' },
];

// ─── BRANDS ──────────────────────────────────────────────────────────────────

export const BRANDS: Brand[] = [
  { id: 'amul', name: 'Amul' },
  { id: 'britannia', name: 'Britannia' },
  { id: 'nestle', name: 'Nestlé' },
  { id: 'itc', name: 'ITC' },
  { id: 'marico', name: 'Marico' },
  { id: 'dabur', name: 'Dabur' },
  { id: 'hindustan-unilever', name: 'HUL' },
  { id: 'patanjali', name: 'Patanjali' },
  { id: 'mdh', name: 'MDH' },
  { id: 'fortune', name: 'Fortune' },
  { id: 'tropicana', name: 'Tropicana' },
  { id: 'pepsico', name: 'PepsiCo' },
  { id: 'coca-cola', name: 'Coca-Cola' },
  { id: 'real', name: 'Real' },
  { id: 'paper-boat', name: 'Paper Boat' },
  { id: 'tata', name: 'Tata Consumer' },
  { id: 'anti-gravity', name: 'Anti Gravity Fresh' },
];

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  // FRUITS & VEGETABLES
  {
    id: 'p001', sku: 'AG-FV-001', name: 'Organic Alphonso Mangoes', slug: 'organic-alphonso-mangoes',
    brand: 'Anti Gravity Fresh', brandId: 'anti-gravity', category: 'Fruits & Vegetables', categoryId: 'fruits-vegetables',
    subcategory: 'Fruits', description: 'Hand-picked Alphonso mangoes from Ratnagiri. Naturally ripened, no artificial ripening agents used. Rich golden pulp with a sweet, intense aroma.',
    shortDescription: 'Premium Ratnagiri Alphonso from certified organic farms.',
    weight: 1, unit: 'kg', mrp: 180, price: 149, discountPercent: 17, taxClass: 'gst-0',
    stock: 142, reorderThreshold: 30, lowStockThreshold: 15, outOfStock: false, perishable: true, expiryDate: '2026-05-15',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop',
    gallery: [], status: 'active', featured: true, bestSeller: true, rating: 4.8, reviewCount: 2847, unitsSold: 18540,
    made_by: 'Anti Gravity Fresh', image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop',
    discount_percent: 17, category_id: 'fruits-vegetables',
  },
  {
    id: 'p002', sku: 'AG-FV-002', name: 'Baby Spinach Leaves', slug: 'baby-spinach-leaves',
    brand: 'Anti Gravity Fresh', brandId: 'anti-gravity', category: 'Fruits & Vegetables', categoryId: 'fruits-vegetables',
    subcategory: 'Leafy Greens', description: 'Tender young spinach leaves, triple-washed and ready to eat. Packed with iron, folate, and vitamins.',
    shortDescription: 'Triple-washed, ready-to-eat baby spinach.',
    weight: 200, unit: 'g', mrp: 65, price: 49, discountPercent: 25, taxClass: 'gst-0',
    stock: 80, reorderThreshold: 20, lowStockThreshold: 10, outOfStock: false, perishable: true, expiryDate: '2026-04-10',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=800&auto=format&fit=crop',
    gallery: [], status: 'active', featured: false, bestSeller: false, rating: 4.5, reviewCount: 843, unitsSold: 5200,
    made_by: 'Anti Gravity Fresh', image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=800&auto=format&fit=crop',
    discount_percent: 25, category_id: 'fruits-vegetables',
  },
  {
    id: 'p003', sku: 'AG-FV-003', name: 'Red Cherry Tomatoes', slug: 'red-cherry-tomatoes',
    brand: 'Anti Gravity Fresh', brandId: 'anti-gravity', category: 'Fruits & Vegetables', categoryId: 'fruits-vegetables',
    subcategory: 'Vegetables', description: 'Vine-ripened cherry tomatoes bursting with natural sweetness. Perfect for salads, pasta, or snacking.',
    shortDescription: 'Vine-ripened, naturally sweet cherry tomatoes.',
    weight: 500, unit: 'g', mrp: 89, price: 69, discountPercent: 22, taxClass: 'gst-0',
    stock: 6, reorderThreshold: 20, lowStockThreshold: 10, outOfStock: false, perishable: true, expiryDate: '2026-04-12',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop',
    gallery: [], status: 'active', featured: false, bestSeller: true, rating: 4.6, reviewCount: 1230, unitsSold: 8900,
    made_by: 'Anti Gravity Fresh', image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop',
    discount_percent: 22, category_id: 'fruits-vegetables',
  },
  {
    id: 'p004', sku: 'AG-FV-004', name: 'Seedless Green Grapes', slug: 'seedless-green-grapes',
    brand: 'Anti Gravity Fresh', brandId: 'anti-gravity', category: 'Fruits & Vegetables', categoryId: 'fruits-vegetables',
    subcategory: 'Fruits', description: 'Crisp, sweet, and seedless. Nashik\'s finest Thompson Seedless grapes, chilled and ready to eat.',
    shortDescription: 'Chilled Nashik Thompson Seedless grapes.',
    weight: 500, unit: 'g', mrp: 120, price: 99, discountPercent: 17, taxClass: 'gst-0',
    stock: 0, reorderThreshold: 25, lowStockThreshold: 10, outOfStock: true, perishable: true,
    imageUrl: 'https://images.unsplash.com/photo-1596333522248-1018508cf69a?q=80&w=800&auto=format&fit=crop',
    gallery: [], status: 'active', featured: false, bestSeller: false, rating: 4.7, reviewCount: 980, unitsSold: 6700,
    made_by: 'Anti Gravity Fresh', image_url: 'https://images.unsplash.com/photo-1596333522248-1018508cf69a?q=80&w=800&auto=format&fit=crop',
    discount_percent: 17, category_id: 'fruits-vegetables',
  },
  {
    id: 'p005', sku: 'AG-DB-001', name: 'Amul Gold Full Cream Milk', slug: 'amul-gold-full-cream-milk',
    brand: 'Amul', brandId: 'amul', category: 'Dairy & Bakery', categoryId: 'dairy-bakery',
    subcategory: 'Milk', description: 'Amul Gold Full Cream Milk with 6% fat content. Rich, creamy, and perfect for tea, coffee, or drinking straight.',
    shortDescription: '6% fat, rich & creamy full cream milk.',
    weight: 1, unit: 'L', mrp: 68, price: 68, discountPercent: 0, taxClass: 'gst-0',
    stock: 320, reorderThreshold: 60, lowStockThreshold: 30, outOfStock: false, perishable: true, expiryDate: '2026-04-06',
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=800&auto=format&fit=crop',
    gallery: [], status: 'active', featured: false, bestSeller: true, rating: 4.9, reviewCount: 12450, unitsSold: 78000,
    made_by: 'Amul', image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=800&auto=format&fit=crop',
    discount_percent: 0, category_id: 'dairy-bakery',
  },
  {
    id: 'p006', sku: 'AG-ST-001', name: 'Toor Dal (Arhar)', slug: 'toor-dal-arhar',
    brand: 'Anti Gravity Fresh', brandId: 'anti-gravity', category: 'Staples & Grains', categoryId: 'staples',
    subcategory: 'Dals', description: 'Premium unpolished toor dal. Rich in protein and essential nutrients. Cooks evenly and tastes delicious with rice or roti.',
    shortDescription: 'Unpolished, protein-rich toor dal.',
    weight: 1, unit: 'kg', mrp: 185, price: 169, discountPercent: 9, taxClass: 'gst-5',
    stock: 250, reorderThreshold: 50, lowStockThreshold: 20, outOfStock: false, perishable: false,
    imageUrl: 'https://images.unsplash.com/photo-1585996838426-edca1986427a?q=80&w=800&auto=format&fit=crop',
    gallery: [], status: 'active', featured: true, bestSeller: true, rating: 4.7, reviewCount: 450, unitsSold: 3200,
  },
  {
    id: 'p007', sku: 'AG-ST-002', name: 'Moong Dal (Pappu)', slug: 'moong-dal-pappu',
    brand: 'Anti Gravity Fresh', brandId: 'anti-gravity', category: 'Staples & Grains', categoryId: 'staples',
    subcategory: 'Dals', description: 'Yellow split moong dal, easy to digest and perfect for a light meal. Sourced from the finest farms.',
    shortDescription: 'Easy to digest yellow moong dal.',
    weight: 1, unit: 'kg', mrp: 160, price: 145, discountPercent: 10, taxClass: 'gst-5',
    stock: 180, reorderThreshold: 40, lowStockThreshold: 15, outOfStock: false, perishable: false,
    imageUrl: 'https://images.unsplash.com/photo-1547847718-69255ca885e0?q=80&w=800&auto=format&fit=crop',
    gallery: [], status: 'active', featured: false, bestSeller: false, rating: 4.6, reviewCount: 320, unitsSold: 1800,
  },
  {
    id: 'p008', sku: 'AG-BV-001', name: 'Coca-Cola Soft Drink', slug: 'coca-cola-2l',
    brand: 'Coca-Cola', brandId: 'coca-cola', category: 'Beverages', categoryId: 'beverages',
    subcategory: 'Soft Drinks', description: 'Classic Coca-Cola refreshing soft drink. Enjoy the great taste of Coke with your family and friends.',
    shortDescription: 'Classic refreshing soft drink 2L.',
    weight: 2, unit: 'L', mrp: 100, price: 89, discountPercent: 11, taxClass: 'gst-28',
    stock: 120, reorderThreshold: 30, lowStockThreshold: 10, outOfStock: false, perishable: false,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=800&auto=format&fit=crop',
    gallery: [], status: 'active', featured: false, bestSeller: true, rating: 4.8, reviewCount: 1500, unitsSold: 12000,
  },
  {
    id: 'p009', sku: 'AG-BV-002', name: 'Paper Boat Aam Panna', slug: 'paper-boat-aam-panna',
    brand: 'Paper Boat', brandId: 'paper-boat', category: 'Beverages', categoryId: 'beverages',
    subcategory: 'Juices', description: 'Traditional Indian summer drink made from raw mangoes. Tangy and sweet.',
    shortDescription: 'Traditional tangy raw mango drink.',
    weight: 250, unit: 'ml', mrp: 40, price: 35, discountPercent: 12, taxClass: 'gst-12',
    stock: 300, reorderThreshold: 50, lowStockThreshold: 20, outOfStock: false, perishable: false,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
    gallery: [], status: 'active', featured: true, bestSeller: false, rating: 4.9, reviewCount: 890, unitsSold: 5600,
  },
  {
    id: 'p010', sku: 'AG-HS-001', name: 'Parker Classic Gold Pen', slug: 'parker-gold-pen',
    brand: 'Parker', brandId: 'parker', category: 'Household', categoryId: 'household',
    subcategory: 'Stationary', description: 'Premium gold-plated ball point pen. Perfect for gifting and personal use.',
    shortDescription: 'Premium gold-plated ball point pen.',
    weight: 1, unit: 'piece', mrp: 500, price: 449, discountPercent: 10, taxClass: 'gst-12',
    stock: 50, reorderThreshold: 10, lowStockThreshold: 5, outOfStock: false, perishable: false,
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-7160b5b18145?q=80&w=800&auto=format&fit=crop',
    gallery: [], status: 'active', featured: false, bestSeller: false, rating: 4.7, reviewCount: 120, unitsSold: 450,
  },
  {
    id: 'p011', sku: 'AG-ST-003', name: 'Premium Basmati Rice', slug: 'premium-basmati-rice',
    brand: 'Anti Gravity Fresh', brandId: 'anti-gravity', category: 'Staples & Grains', categoryId: 'staples',
    subcategory: 'Rice', description: 'Long grain aromatic basmati rice. Perfect for biryani and pulao.',
    shortDescription: 'Long grain aromatic basmati rice 5kg.',
    weight: 5, unit: 'kg', mrp: 1200, price: 999, discountPercent: 17, taxClass: 'gst-5',
    stock: 100, reorderThreshold: 20, lowStockThreshold: 10, outOfStock: false, perishable: false,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop',
    gallery: [], status: 'active', featured: true, bestSeller: true, rating: 4.8, reviewCount: 2100, unitsSold: 8500,
  },
  {
    id: 'p012', sku: 'AG-SN-001', name: 'Lays Classic Salted Chips', slug: 'lays-classic-salted',
    brand: 'PepsiCo', brandId: 'pepsico', category: 'Snacks & Munchies', categoryId: 'snacks',
    subcategory: 'Chips', description: 'Crisp and tasty potato chips. Perfect for snacking.',
    shortDescription: 'Crisp potato chips salted.',
    weight: 150, unit: 'g', mrp: 50, price: 45, discountPercent: 10, taxClass: 'gst-12',
    stock: 500, reorderThreshold: 100, lowStockThreshold: 50, outOfStock: false, perishable: false,
    imageUrl: 'https://images.unsplash.com/photo-1566478489297-f6963c93fc3a?q=80&w=800&auto=format&fit=crop',
    gallery: [], status: 'active', featured: false, bestSeller: true, rating: 4.5, reviewCount: 5600, unitsSold: 45000,
  },
];

// ─── RECENT ORDERS ───────────────────────────────────────────────────────────

export const RECENT_ORDERS: Order[] = [
  {
    id: 'ord001', orderNumber: 'AG-2026-4821', customerId: 'u001', customerName: 'Preetham Kumar', customerEmail: 'preetham@email.com',
    items: [
      { productId: 'p001', productName: 'Organic Alphonso Mangoes', product_name: 'Organic Alphonso Mangoes', sku: 'AG-FV-001', imageUrl: PRODUCTS[0].imageUrl, quantity: 2, mrp: 180, price: 149, total: 298 },
    ],
    subtotal: 502, deliveryFee: 0, discount: 50, tax: 0, total: 452, totalAmount: 452,
    status: 'delivered', paymentStatus: 'paid', paymentMethod: 'razorpay', paymentId: 'pay_abc123',
    address: { id: 'a001', label: 'Home', line1: '12, MG Road', city: 'Nellore', state: 'Andhra Pradesh', pincode: '524001', isDefault: true },
    shippingAddress: { id: 'a001', label: 'Home', line1: '12, MG Road', city: 'Nellore', state: 'Andhra Pradesh', pincode: '524001', isDefault: true },
    deliverySlot: '10:00 AM - 12:00 PM', couponCode: 'FRESH50', createdAt: '2026-04-02T09:30:00Z', updatedAt: '2026-04-02T11:45:00Z',
  },
  {
    id: 'ord002', orderNumber: 'AG-2026-4822', customerId: 'u002', customerName: 'Anjali Sharma', customerEmail: 'anjali@email.com',
    items: [
      { productId: 'p001', productName: 'Organic Alphonso', product_name: 'Organic Alphonso', sku: 'AG-FV-001', imageUrl: PRODUCTS[0].imageUrl, quantity: 1, mrp: 180, price: 149, total: 149 },
    ],
    subtotal: 149, deliveryFee: 40, discount: 0, tax: 0, total: 189, totalAmount: 189,
    status: 'out_for_delivery', paymentStatus: 'paid', paymentMethod: 'upi',
    address: { id: 'a002', label: 'Work', line1: '204, Brigade Road', city: 'Bangalore', state: 'Karnataka', pincode: '560025', isDefault: false },
    shippingAddress: { id: 'a002', label: 'Work', line1: '204, Brigade Road', city: 'Bangalore', state: 'Karnataka', pincode: '560025', isDefault: false },
    deliverySlot: '02:00 PM - 04:00 PM', createdAt: '2026-04-03T07:15:00Z', updatedAt: '2026-04-03T10:30:00Z',
  },
];

export const ORDERS = RECENT_ORDERS;
export const ORDER_STATUSES: OrderStatus[] = ['draft', 'pending_payment', 'confirmed', 'packed', 'processing', 'out_for_delivery', 'delivered', 'cancelled', 'failed', 'returned', 'refunded'];

export const ANALYTICS_SUMMARY: AnalyticsSummary = {
  totalRevenue: 284750, revenueGrowth: 18.4,
  ordersToday: 47, ordersTodayGrowth: 12.1,
  salesToday: 18920, unitsSoldToday: 183,
  avgOrderValue: 402, aovGrowth: 5.8,
  activeCustomers: 1284, refundTotal: 8420,
  lowStockCount: 3, outOfStockCount: 1,
};

export const DAILY_SALES_DATA = [
  { day: 'Mon', revenue: 14500, orders: 120 },
  { day: 'Tue', revenue: 16800, orders: 142 },
  { day: 'Wed', revenue: 15200, orders: 135 },
  { day: 'Thu', revenue: 19400, orders: 168 },
  { day: 'Fri', revenue: 21000, orders: 185 },
  { day: 'Sat', revenue: 24500, orders: 215 },
  { day: 'Sun', revenue: 22100, orders: 198 },
];

const DATA_24H = [
  { day: '00:00', revenue: 1200, orders: 8 },
  { day: '04:00', revenue: 400, orders: 2 },
  { day: '08:00', revenue: 3200, orders: 22 },
  { day: '12:00', revenue: 5400, orders: 45 },
  { day: '16:00', revenue: 4100, orders: 38 },
  { day: '20:00', revenue: 6800, orders: 52 },
];

const DATA_30D = [
  { day: 'Week 1', revenue: 112000, orders: 840 },
  { day: 'Week 2', revenue: 128000, orders: 960 },
  { day: 'Week 3', revenue: 104000, orders: 780 },
  { day: 'Week 4', revenue: 145000, orders: 1100 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getInventoryHealth(product: Product): InventoryHealth {
  if (product.outOfStock || product.stock === 0) return 'out_of_stock';
  if (product.stock <= (product.lowStockThreshold || 5)) return 'critical';
  if (product.stock <= (product.reorderThreshold || 10)) return 'low';
  return 'healthy';
}

export function getAnalyticsKPIs(range: string = '7d') {
  const multiplier = range === '24h' ? 0.15 : range === '30d' ? 4.2 : 1;
  return {
    totalRevenue: Math.round(ANALYTICS_SUMMARY.totalRevenue * multiplier),
    activeOrders: Math.max(1, Math.round(ORDERS.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length * multiplier)),
    totalCustomers: Math.round(ANALYTICS_SUMMARY.activeCustomers * (range === '24h' ? 0.05 : multiplier)),
    lowStockCount: PRODUCTS.filter(p => p.stock > 0 && p.stock <= 10).length,
    outOfStockCount: PRODUCTS.filter(p => p.stock === 0).length,
  };
}

export function getRevenueHistory(range: string = '7d') { 
  if (range === '24h') return DATA_24H;
  if (range === '30d') return DATA_30D;
  return DAILY_SALES_DATA; 
}

export function getInventoryHealthData() {
  return { healthyCount: 120, lowCount: 5, criticalCount: 2 };
}

export function getTopSellingProducts() { return PRODUCTS.slice(0, 5); }
export function getLiveOrders() { return ORDERS.filter(o => o.status !== 'delivered'); }

export function getProductsByCategory(id: string) { return PRODUCTS.filter(p => p.categoryId === id); }
export function getFeaturedProducts() { return PRODUCTS.filter(p => p.featured); }
export function getBestSellers() { return PRODUCTS.filter(p => p.bestSeller); }
export function getNewArrivals() { return PRODUCTS.slice(-4); }
export function getDeals() { return PRODUCTS.filter(p => p.discountPercent > 15); }

export const BANNERS = [
  {
    id: 'b1', title: "Summer's Freshest Mangoes", subtitle: 'Handpicked Alphonso mangoes, farm to door in 24 hours.',
    cta: 'Shop Mangoes', ctaLink: '/products', badge: '🌞 Summer Special',
    bgFrom: '#ff6b00', bgTo: '#ff9a3c', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1200'
  },
  {
    id: 'b2', title: "Premium Staples", subtitle: 'Best quality Dals, Rice, and Grains for your daily needs.',
    cta: 'Browse Staples', ctaLink: '/products?category=staples', badge: '🌾 Daily Essentials',
    bgFrom: '#4CAF50', bgTo: '#8BC34A', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200'
  },
  {
    id: 'b3', title: "Quench Your Thirst", subtitle: 'Chilled beverages and juices delivered to your doorstep.',
    cta: 'Order Drinks', ctaLink: '/products?category=beverages', badge: '🥤 Refreshing',
    bgFrom: '#2196F3', bgTo: '#00BCD4', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1200'
  },
  {
    id: 'b4', title: "Stationary Corner", subtitle: 'Pens, notebooks, and office supplies for you.',
    cta: 'Check Items', ctaLink: '/products?category=household', badge: '✏️ Work Ready',
    bgFrom: '#9C27B0', bgTo: '#E91E63', image: 'https://images.unsplash.com/photo-1583485088034-7160b5b18145?q=80&w=1200'
  }
];

export const COUPONS: Coupon[] = [
  { id: 'c1', code: 'GRAVITY10', description: '10% off on orders above ₹100', type: 'percent', value: 10, minOrder: 100, usageLimit: 100, usedCount: 10, active: true, expiresAt: '2026-12-31' },
  { id: 'c2', code: 'WELCOME100', description: 'Flat ₹100 off on orders above ₹499', type: 'flat', value: 100, minOrder: 499, usageLimit: 50, usedCount: 5, active: true, expiresAt: '2026-12-31' }
];

export function applyCoupon(code: string, subtotal: number) {
  const coupon = COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());
  
  if (!coupon) return { discount: 0, error: 'Invalid coupon code' };
  if (!coupon.active) return { discount: 0, error: 'Coupon is no longer active' };
  if (subtotal < coupon.minOrder) return { discount: 0, error: `Minimum order of ₹${coupon.minOrder} required for this coupon` };

  let discount = 0;
  if (coupon.type === 'percent') {
    discount = Math.round(subtotal * (coupon.value / 100));
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.value;
  }

  return { discount, error: null };
}
