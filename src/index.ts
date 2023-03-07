import 'reflect-metadata';
import { Server } from 'http';
import dotenv from 'dotenv';
dotenv.config();
import { createApp } from './app';
import { AppDataSource } from './core/database';
import { DataSource } from 'typeorm';
import { Config } from './core/config';
import { logger } from './core/utils/logger.util';

let server: Server;
let datasource: DataSource;

function gracefulShutdown(): void {
  logger.warn('Graceful shutdown');
  if (!server) return;

  logger.warn('Sever is shutting down');

  server.close(async () => {
    logger.warn('Server is closed');

    if (datasource) {
      logger.warn('Database connection is shutting down');
      await datasource.destroy();
      logger.warn('Database connection is shudown');
    }
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, Config.SERVER_SHUTDOWN_TIMEOUT);
}

async function bootstrap(): Promise<void> {
  datasource = await AppDataSource.initialize();

  const port = parseInt(process.env.SERVER_PORT || '3005', 10);
  const app = await createApp();

  server = app.listen(port, () => {
    logger.info('Listening at port: ' + port);
  });
}

process
  .on('SIGTERM', () => {
    // Process manager (pm2, docker) send SIGTERM
    logger.warn('SIGTERM received');
    gracefulShutdown();
  })
  .on('SIGINT', () => {
    // Ctrl - C
    logger.warn('SIGINT received');
    gracefulShutdown();
  })
  .on('unhandledRejection', (err) => {
    logger.error('unhandledRejection');
    logger.error(err);
    gracefulShutdown();
  });

bootstrap();
