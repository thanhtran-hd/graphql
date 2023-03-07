import { Args, Query, Resolver } from 'type-graphql';
import { User, UsersArgs } from './users.schema';
import { UserService } from './users.service';

@Resolver((_return) => User)
export class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Query((_return) => User)
  async users(@Args() args: UsersArgs) {
    const newUser = await this.userService.getUser(args);
    return newUser;
  }
}
