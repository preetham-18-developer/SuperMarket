import { Redis } from 'ioredis';
import logger from '../utils/logger.js';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(redisUrl, {
  retryStrategy: (times: number) => {
    // Only try reconnecting 10 times, with increasing delay
    if (times > 10) return null;
    return Math.min(times * 50, 2000);
  },
  maxRetriesPerRequest: 3
});

redis.on('error', (err) => {
  logger.error('REDIS_ERROR:', { message: err.message, stack: err.stack });
});

redis.on('connect', () => {
  logger.info('REDIS_CONNECTED: Using Redis for caching and rate limiting');
});

export default redis;
