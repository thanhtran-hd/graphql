import cors from 'cors';
import express, { NextFunction, Express } from 'express';
import { Request, Response } from 'express';
import { HttpError, InternalServerError } from 'http-errors';
import { Config } from './core/config';
import { logger } from './core/utils/logger.util';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { User } from './users/users.schema';
import { AppDataSource } from './core/database';
import { Context } from './types/context';
import { verifyJwt } from './core/utils/jwt';
import { authChecker } from './core/auth_checker';

export async function createApp(): Promise<Express> {
  await AppDataSource.initialize();
  logger.info('Database is connect');
  const app = express();

  app.use(cors(Config.CORS_OPTIONS));

  const schema = await buildSchema({
    resolvers: [__dirname + '/**/*.resolver.{ts,js}'],
    authChecker,
  });

  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      if (ctx.req.headers?.authorization) {
        const user = verifyJwt<User>(ctx.req.headers?.authorization, Config.JWT_SECRET_KEY);
        if (user) {
          ctx.user = user;
        }
      }
      return ctx;
    },
    plugins: [
      Config.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault
        : ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });

  // Start the server
  await server.start();
  server.applyMiddleware({ app });

  app.listen(3001, () => {
    logger.info(`Server is running, http://localhost:3001/graphql`);
  });

  //Error handler
  app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error(error);
    if (error instanceof HttpError) {
      if (error instanceof InternalServerError) {
        logger.error(error);
      }
      return res.status(error.statusCode).send({ error: error.message, details: error.details });
    }
    logger.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  });

  return app;
}

createApp();
