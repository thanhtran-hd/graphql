import { Min } from 'class-validator';
import { ArgsType, Field, InputType, Int, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { PaginationArgs } from '../core/utils/pagination';
import { Voucher } from '../vouchers/vouchers.schema';

@ObjectType()
@Entity('events')
export class Event {
  constructor(data: Partial<Event>) {
    Object.assign(this, data);
  }

  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field((_type) => Int)
  @Column()
  maximum: number;

  @Field((_type) => Int)
  @Column()
  quantity: number;

  @Field((_type) => [Voucher])
  @OneToMany(() => Voucher, (voucher) => voucher.event)
  vouchers: Relation<Voucher>[];
}

@InputType()
export class CreateEventInput implements Partial<Event> {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field((_type) => Int)
  @Min(0)
  maximum: number;
}

@ArgsType()
export class EventsArgs extends PaginationArgs {}
