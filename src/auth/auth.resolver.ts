import { Arg, Authorized, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '../users/users.schema';
import { LoginInput, LoginResponse, RegisterInput } from './auth.schema';
import { AuthService } from './auth.service';
import { Context } from '../types/context';
import { HandlerError } from '../core/middleware/handler-error.middleware';

@Resolver((_return) => User)
export class AuthResolver {
  constructor(private authService: AuthService) {
    this.authService = new AuthService();
  }

  @Mutation((_return) => User)
  @UseMiddleware(HandlerError)
  async register(@Arg('input') input: RegisterInput) {
    const newUser = await this.authService.register(input);
    return newUser;
  }

  @Mutation((_return) => LoginResponse)
  @UseMiddleware(HandlerError)
  async login(@Arg('input') input: LoginInput) {
    const newUser = await this.authService.login(input);
    return newUser;
  }

  @Authorized()
  @Query((_return) => User)
  @UseMiddleware(HandlerError)
  me(@Ctx() context: Context) {
    return context.user;
  }
}
