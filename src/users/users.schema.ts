import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../core/enum';

@ObjectType()
@Entity('users')
export class User {
  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  hashedPassword: string;

  @Field()
  @Column()
  fullname: string;

  @Field()
  @Column({ type: 'enum', enum: Roles, default: Roles.AUTHOR })
  role: Roles;
}

@ArgsType()
export class UsersArgs {
  @Field((_type) => Int)
  @Min(0)
  skip: number;

  @Field((_type) => Int)
  @Min(1)
  @Max(50)
  take: 25;
}
