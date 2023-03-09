import { AppDataSource } from '../core/database';
import { User } from '../users/users.schema';
import { Event } from '../events/events.schema';
import { CreateVoucherInput, Voucher } from './vouchers.schema';
import { setTimeout } from 'timers/promises';
import otpGenerator from 'otp-generator';

export class VoucherService {
  private voucherRepo = AppDataSource.getRepository(Voucher);
  async getVouchersField<T>(root: T): Promise<Voucher[]> {
    let vouchers;
    if (root instanceof Event) {
      const event = new Event(root);
      vouchers = await this.voucherRepo.find({ where: { eventId: event.id } });
    }

    if (root instanceof User) {
      const user = new User(root);
      vouchers = await this.voucherRepo.find({ where: { eventId: user.id } });
    }

    return vouchers as Voucher[];
  }

  async create(input: CreateVoucherInput, user: User) {
    const code = otpGenerator.generate(12);

    const newVoucher = new Voucher({ eventId: input.eventId, code, userId: user.id });

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager
        .createQueryBuilder()
        .update(Event)
        .set({ quantity: () => 'quantity - 1' })
        .where('id = :id and quantity > 0', { id: input.eventId })
        .execute();

      if (!result.affected) {
        throw new Error('Out of stock voucher');
      }

      const voucher = await queryRunner.manager.save(newVoucher);
      await setTimeout(0);
      // throw new Error('Out of stock voucher');

      await queryRunner.commitTransaction();
      return voucher;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return null;
  }
}
