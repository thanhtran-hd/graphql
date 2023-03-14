import { ConnectionOptions } from 'bullmq';
import { Config } from '../config';

export const redisConnection: ConnectionOptions = {
  host: Config.REDIS_HOST,
  port: Config.REDIS_PORT,
  db: Config.REDIS_DB, // redis provide 16 db
};
