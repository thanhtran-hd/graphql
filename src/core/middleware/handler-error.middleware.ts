import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-core';
import { MiddlewareFn } from 'type-graphql';
import { logger } from '../utils/logger.util';

export const ErrorInterceptor: MiddlewareFn = async (_context, next) => {
  try {
    await next();
  } catch (err) {
    if (!(err instanceof UserInputError || err instanceof AuthenticationError || err instanceof ForbiddenError)) {
      logger.error(err);
    }
    throw err;
  }
};
