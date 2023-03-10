import { AppDataSource } from '../core/connection/database';
import { User } from '../users/users.schema';
import { Event } from '../events/events.schema';
import { CreateVoucherInput, Voucher } from './vouchers.schema';
import { setTimeout } from 'timers/promises';
import otpGenerator from 'otp-generator';
import { SENDMAIL_QUEUE } from '../core/constant';
import { sendVoucherCodeQueue } from '../bullmq/queues/sendmail.queues';
import { MoreThan } from 'typeorm';
import { ApolloError } from 'apollo-server-core';

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
    let voucher = null;
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.decrement(
        Event,
        { id: input.eventId, quantity: MoreThan(0) },
        'quantity',
        1,
      );

      if (!result.affected) {
        throw new ApolloError('Out of stock voucher', 'OUT_OF_STOCK_ERROR');
      }

      voucher = await queryRunner.manager.save(newVoucher);
      await setTimeout(6000);
      // throw new Error('Out of stock voucher');

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    if (voucher) {
      this.sendCodeVoucher(user.email, code, input.eventId);
      return voucher;
    }
    throw new ApolloError('Out of stock voucher', 'OUT_OF_STOCK_ERROR');
  }

  async sendCodeVoucher(email: string, code: string, eventId: number): Promise<void> {
    sendVoucherCodeQueue.add(SENDMAIL_QUEUE, { email, code, event: eventId });
  }
}
