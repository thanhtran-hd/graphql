import { Response, Request } from 'express';
import { User } from '../users/users.schema';

export interface Context {
  req: Request;
  res: Response;
  user: User | null;
}
