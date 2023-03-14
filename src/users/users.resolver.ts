import { Args, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Voucher } from '../vouchers/vouchers.schema';
import { User, UsersArgs } from './users.schema';
import { UserService } from './users.service';

@Resolver((_return) => User)
export class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Query((_return) => [User])
  async users(@Args() args: UsersArgs) {
    const users = await this.userService.getUser(args);
    return users;
  }
}

@Resolver((_of) => Voucher)
export class VouchersOfUser {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @FieldResolver()
  async user(@Root() voucher: Voucher) {
    const vouchers = await this.userService.getUserField(voucher);
    return vouchers;
  }
}
