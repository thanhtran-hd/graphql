import { Arg, Authorized, Ctx, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { VoucherService } from './voucher.service';
import { User } from '../users/users.schema';
import { CreateVoucherInput, Voucher } from './vouchers.schema';
import { Context } from '../types/context';

@Resolver((_return) => Voucher)
export class VoucherResolver {
  constructor(private voucherService: VoucherService) {
    this.voucherService = new VoucherService();
  }

  @Authorized()
  @Mutation((_return) => Voucher)
  async createVoucher(@Arg('input') input: CreateVoucherInput, @Ctx() context: Context) {
    const newVoucher = await this.voucherService.create(input, context.user);

    return newVoucher;
  }
}

// @Resolver((_of) => Event)
// export class VouchersOfEvent {
//   constructor(private voucherService: VoucherService) {
//     this.voucherService = new VoucherService();
//   }

//   @FieldResolver()
//   async vouchers(@Root() event: Event) {
//     const vouchers = await this.voucherService.getVouchersField<Event>(event);
//     return vouchers;
//   }
// }

@Resolver((_of) => User)
export class VoucherOfUser {
  constructor(private voucherService: VoucherService) {
    this.voucherService = new VoucherService();
  }

  @FieldResolver()
  async vouchers(@Root() user: User) {
    const vouchers = await this.voucherService.getVouchersField<User>(user);
    return vouchers;
  }
}
