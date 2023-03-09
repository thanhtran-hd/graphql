import { Field, InputType, Int, ObjectType } from 'type-graphql';
import { IsOptional, IsPositive } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from '../users/users.schema';
import { Event } from '../events/events.schema';

@ObjectType()
@Entity('vouchers')
export class Voucher {
  constructor(data: Partial<Voucher>) {
    Object.assign(this, data);
  }

  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  code: string;

  @Field((_type) => User)
  @ManyToOne(() => User, (user) => user.vouchers)
  user: Relation<User>;

  @Field((_type) => Event)
  @ManyToOne(() => Event, (event) => event.vouchers)
  event: Relation<Event>;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  eventId: number;
}

@InputType()
export class CreateVoucherInput implements Partial<Voucher> {
  @IsOptional()
  @IsPositive()
  @Field((_type) => Int)
  eventId: number;
}
