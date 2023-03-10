import { AppDataSource } from '../core/connection/database';
import { Voucher } from '../vouchers/vouchers.schema';
import { User, UsersArgs } from './users.schema';

export class UserService {
  private userRepo = AppDataSource.getRepository(User);

  async getUser({ skip, take }: UsersArgs): Promise<User[]> {
    const result = await this.userRepo.find({ skip, take });
    return result;
  }

  async getUserField(voucher: Voucher): Promise<User | null> {
    const resutlt = await this.userRepo.findOne({ where: { id: voucher.userId } });

    return resutlt;
  }
}
