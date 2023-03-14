import dotenv from 'dotenv';
dotenv.config();
import { Worker } from 'bullmq';

import { redisConnection } from './core/connection/redis.connection';
// import { processsors } from './bullmq/processors';
import { BULL } from './core/constant';
import { logger } from './core/utils/logger.util';
import { Config } from './core/config';
import { processsors } from './bullmq/processors';
import { AppDataSource } from './core/connection/database';
import { EventService } from './events/events.service';

const queues = Config.BULLMQ_QUEUES;
const workers: Worker[] = [];

queues.forEach((queue) => {
  const worker = new Worker(queue, processsors[queue], {
    connection: redisConnection,
    concurrency: BULL.QUEUE.SENDMAIL.CONCURENCY,
  });

  workers.push(worker);

  worker.on('failed', async (job) => {
    if (job?.attemptsMade === BULL.QUEUE.SENDMAIL.TOTAL_ATTEMPTS) {
      await AppDataSource.initialize();
      await new EventService().revertEvent(job.data.event);
    }
  });

  logger.info(`Listening queue ${queue}`);
});

logger.info('Worker is started');

async function gracefulShutdown() {
  workers.forEach(async (worker) => {
    await worker.close();
  });

  logger.info('All workers are close');
  process.exit(1);
}

process
  .on('SIGTERM', async () => {
    // Process manager (pm2, docker) send SIGTERM
    logger.warn('SIGTERM received');
    await gracefulShutdown();
  })
  .on('SIGINT', async () => {
    // Ctrl - C
    logger.warn('SIGINT received');
    await gracefulShutdown();
  })
  .on('unhandledRejection', async (err) => {
    logger.error('unhandledRejection');
    logger.error(err);
    await gracefulShutdown();
  });
