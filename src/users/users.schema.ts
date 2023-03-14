import { ArgsType, Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Roles } from '../core/enum';
import { PaginationArgs } from '../core/utils/pagination';
import { Editor } from '../events/events.schema';
import { Voucher } from '../vouchers/vouchers.schema';

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

  @Field((_type) => Roles)
  @Column({ type: 'enum', enum: Roles, default: Roles.AUTHOR })
  role: Roles;

  @Field((_type) => [Voucher])
  @OneToMany(() => Voucher, (voucher) => voucher.user)
  vouchers: Relation<Voucher[]>;

  @Field((_type) => Editor)
  @OneToMany(() => Editor, (editor) => editor.event)
  editor: Promise<Editor>;
}

@ArgsType()
export class UsersArgs extends PaginationArgs {}
