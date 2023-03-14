import winston from 'winston';
import path from 'path';
import { Config } from '../config';

let transports;

if (Config.NODE_ENV === 'production') {
  transports = [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.resolve('logger', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.resolve('logger', 'combined.log') }),
  ];
} else {
  transports = [new winston.transports.Console()];
}

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.colorize(),
    winston.format.printf((log) => {
      // nếu log là error hiển thị stack trace còn không hiển thị message của log
      if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
      return `[${log.timestamp}] [${log.level}] ${log.message}`;
    }),
  ),
  transports,
});
