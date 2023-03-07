import { AppDataSource } from '../core/database';
import { User, UsersArgs } from './users.schema';

export class UserService {
  private userRepo = AppDataSource.getRepository(User);

  async getUser({ skip, take }: UsersArgs): Promise<User[]> {
    const result = await this.userRepo.find({ skip, take });
    return result;
  }
}
