import { MiddlewareFn } from 'type-graphql';
import { BadRequest, InternalServerError, OutOfStock, Unauthorized } from '../utils/errors.util';
import { logger } from '../utils/logger.util';

export const HandlerError: MiddlewareFn = async (_context, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof (BadRequest || OutOfStock || Unauthorized)) {
      throw err;
    }
    logger.error(err);
    throw new InternalServerError('Internal Server Error');
  }
};
