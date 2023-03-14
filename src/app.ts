import cors from 'cors';
import express, { Express } from 'express';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import Keyv from 'keyv';
import { Config } from './core/config';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { User } from './users/users.schema';
import { Context } from './types/context';
import { verifyJwt } from './core/utils/jwt';
import { authChecker } from './core/helper/auth_checker';
import { ErrorInterceptor } from './core/middleware/handler-error.middleware';

export async function createApp(): Promise<Express> {
  const app = express();

  app.use(cors(Config.CORS_OPTIONS));

  const schema = await buildSchema({
    resolvers: [__dirname + '/**/*.resolver.{ts,js}'],
    authChecker,
    globalMiddlewares: [ErrorInterceptor],
  });

  const server = new ApolloServer({
    schema,
    context: (ctx: Context): Context => {
      if (ctx.req.headers?.authorization) {
        const user = verifyJwt<User>(ctx.req.headers?.authorization, Config.JWT_SECRET_KEY);
        if (user) {
          ctx.user = user;
        }
      }
      return ctx;
    },
    persistedQueries: false,
    cache: new KeyvAdapter(new Keyv(Config.REDIS_CACHE_URI)),
    plugins: [
      Config.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault
        : ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });

  // Start the server
  await server.start();
  server.applyMiddleware({ app });

  return app;
}
