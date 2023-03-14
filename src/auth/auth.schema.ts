import { MinLength } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import { User } from '../users/users.schema';

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field()
  fullname: string;
}

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  @MinLength(8)
  password: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
}
