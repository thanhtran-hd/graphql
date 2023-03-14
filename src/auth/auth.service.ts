import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../core/connection/database';
import { User } from '../users/users.schema';
import { ROUNDS_NUMBER } from '../core/constant';
import { Config } from '../core/config';
import { LoginInput, LoginResponse, RegisterInput } from './auth.schema';
import { signJwt } from '../core/utils/jwt';
import { AuthenticationError, UserInputError } from 'apollo-server-core';

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  async register(registerInput: RegisterInput): Promise<User> {
    const duplicatedUser = await this.userRepo.findOneBy({
      email: registerInput.email,
    });

    if (duplicatedUser) {
      throw new UserInputError('Email already existed');
    }
    const newUser = new User(registerInput);

    newUser.hashedPassword = await bcrypt.hash(registerInput.password, ROUNDS_NUMBER);
    await this.userRepo.save(newUser);

    return newUser;
  }

  async login(loginInput: LoginInput): Promise<LoginResponse> {
    const user = await this.userRepo.findOne({
      where: {
        email: loginInput.email,
      },
      select: ['email', 'fullname', 'hashedPassword', 'id', 'role'],
    });

    if (!user) {
      throw new AuthenticationError('Email or password invalid');
    }

    const isValid = await bcrypt.compare(loginInput.password, user.hashedPassword);

    if (!isValid) {
      throw new AuthenticationError('Email or password is incorrect');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullname: user.fullname,
    };

    const token = signJwt(payload, Config.JWT_SECRET_KEY, Config.JWT_EXPIRATION);
    return { accessToken: token };
  }
}
