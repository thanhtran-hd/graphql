import { Response, Request } from 'express';
import { NextFn } from 'type-graphql';
import { User } from '../users/users.schema';

export interface Context {
  req: Request;
  res: Response;
  user: User;
  next: NextFn;
}
