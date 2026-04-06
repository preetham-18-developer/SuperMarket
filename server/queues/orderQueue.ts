import { Queue, Worker } from 'bullmq';
import redis from '../config/redis.js';
import logger from '../utils/logger.js';

// ── BULLMQ QUEUE DEFINITION ──────────────────────────────────────────────────
export const orderQueue = new Queue('orders_fulfillment', { 
  connection: redis,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false
  }
});

// ── BACKGROUND WORKER (Processes heavy tasks away from the main thread) ──────
export const orderWorker = new Worker('orders_fulfillment', async (job) => {
  const { type, data } = job.data;
  
  logger.info(`QUEUE_JOB_START: ${job.id} [${type}]`);

  try {
    switch (type) {
      case 'ORDER_EMAIL_CONFIRMATION':
        // logic for processing email (resend.ts refactor)
        logger.info(`EMAIL_SENT: ${data.orderId}`);
        break;
      
      case 'WHATSAPP_NOTIFICATION':
        // logic for Twilio (whatsapp.ts refactor)
        logger.info(`WHATSAPP_SENT: ${data.phone}`);
        break;

      case 'PAYMENT_VERIFICATION':
        // logic for Razorpay verification
        logger.info(`PAYMENT_VERIFIED: ${data.paymentId}`);
        break;

      default:
        logger.warn(`UNKNOWN_JOB_TYPE: ${type}`);
    }
  } catch (error: any) {
    logger.error(`QUEUE_JOB_FAILED: ${job.id} [${type}]`, { message: error.message });
    throw error; // Let BullMQ retry
  }
}, { connection: redis });

orderWorker.on('failed', (job, err) => {
  logger.error(`WORKER_ERROR: Job ${job?.id} failed critically`, { error: err.message });
});
