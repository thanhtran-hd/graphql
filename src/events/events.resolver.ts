import { Arg, Args, Authorized, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { HandlerError } from '../core/middleware/handler-error.middleware';
import { Voucher } from '../vouchers/vouchers.schema';
import { CreateEventInput, Event, EventsArgs } from './events.schema';
import { EventService } from './events.service';

@Resolver((_return) => Event)
export class EventResolver {
  constructor(private eventService: EventService) {
    this.eventService = new EventService();
  }

  @Mutation((_return) => Event)
  @UseMiddleware(HandlerError)
  async createEvent(@Arg('input') input: CreateEventInput) {
    const newEvent = await this.eventService.create(input);
    return newEvent;
  }

  @Authorized()
  @Query((_return) => [Event])
  @UseMiddleware(HandlerError)
  async events(@Args() args: EventsArgs) {
    const events = await this.eventService.getEvent(args);
    return events;
  }
}

@Resolver((_of) => Voucher)
export class VouchersOfEvent {
  constructor(private eventService: EventService) {
    this.eventService = new EventService();
  }

  @FieldResolver()
  async event(@Root() voucher: Voucher) {
    const vouchers = await this.eventService.getEventField(voucher);
    return vouchers;
  }
}
