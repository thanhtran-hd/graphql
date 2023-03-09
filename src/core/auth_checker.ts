import { AuthChecker } from 'type-graphql';
import { Context } from '../types/context';

export const authChecker: AuthChecker<Context> = ({ context: { user } }, roles) => {
  if (roles.length === 0) {
    return user !== undefined;
  }

  if (!user) {
    return false;
  }
  if (roles.some((role) => role === user.role)) {
    return true;
  }

  return false;
};
