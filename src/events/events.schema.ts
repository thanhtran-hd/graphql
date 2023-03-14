import { IsOptional, IsPositive, Min } from 'class-validator';
import { ArgsType, Field, InputType, Int, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { PaginationArgs } from '../core/utils/pagination';
import { User } from '../users/users.schema';
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
  vouchers: Promise<Voucher[]>;

  @Field((_type) => Editor)
  @OneToMany(() => Editor, (editor) => editor.event)
  editor: Promise<Editor>;
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

@ObjectType()
@Entity('editors')
export class Editor {
  constructor(data: Partial<Editor>) {
    Object.assign(this, data);
  }

  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: Date })
  expiredAt: Date;

  @Field((_type) => User)
  @OneToOne(() => User, (user) => user.editor)
  @JoinColumn()
  user: Promise<User>;

  @Field((_type) => Event)
  @OneToOne(() => Event, (event) => event.editor)
  @Unique('unique event', ['event_id'])
  @JoinColumn({ name: 'event_id' })
  event: Promise<Event>;

  @Column()
  eventId: number;

  @Column()
  userId: number;
}

@InputType()
export class EditorInput implements Partial<Editor> {
  @IsOptional()
  @IsPositive()
  @Field((_type) => Int)
  eventId: number;
}
