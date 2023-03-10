import { AuthChecker } from 'type-graphql';
import { Context } from '../../types/context';

export const authChecker: AuthChecker<Context> = ({ context: { user } }, roles) => {
  if (!user) {
    return false;
  }

  if (!roles.length) {
    return true;
  }

  return roles.some((role) => role === user.role);
};
