import { Queue } from 'bullmq';
import { redisConnection } from '../../core/connection/redis.connection';
import { BULL, SENDMAIL_QUEUE } from '../../core/constant';

export const sendVoucherCodeQueue = new Queue(SENDMAIL_QUEUE, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: BULL.QUEUE.SENDMAIL.TOTAL_ATTEMPTS,
    backoff: {
      type: 'exponential',
      delay: BULL.QUEUE.SENDMAIL.BACKOFF_DELAY,
    },
  },
});
