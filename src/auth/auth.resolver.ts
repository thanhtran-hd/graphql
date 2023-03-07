import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../users/users.schema';
import { LoginInput, LoginResponse, RegisterInput } from './auth.schema';
import { AuthService } from './auth.service';
import { Context } from '../types/context';

@Resolver((_return) => User)
export class AuthResolver {
  constructor(private authService: AuthService) {
    this.authService = new AuthService();
  }

  @Mutation((_return) => User)
  async register(@Arg('input') input: RegisterInput) {
    const newUser = await this.authService.register(input);
    return newUser;
  }

  @Mutation((_return) => LoginResponse)
  async login(@Arg('input') input: LoginInput) {
    const newUser = await this.authService.login(input);
    return newUser;
  }

  @Query((_return) => User, { nullable: true })
  me(@Ctx() context: Context) {
    return context.user;
  }
}
