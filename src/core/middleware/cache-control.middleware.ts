import { CacheScope } from 'apollo-server-types';
import { MiddlewareFn } from 'type-graphql';

export const CacheControl: MiddlewareFn = async (context, next) => {
  context.info.cacheControl.setCacheHint({ maxAge: 90, scope: CacheScope.Public });

  await next();
};
