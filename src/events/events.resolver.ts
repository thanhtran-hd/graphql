import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../types/context';
import { CreateEventInput, Editor, EditorInput, Event, EventsArgs } from './events.schema';
import { EventService } from './events.service';

@Resolver((_return) => Event)
export class EventResolver {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  @Mutation((_return) => Event)
  async createEvent(@Arg('input') input: CreateEventInput) {
    const newEvent = await this.eventService.create(input);
    return newEvent;
  }

  @Authorized()
  @Query((_return) => [Event])
  async events(@Args() args: EventsArgs) {
    const events = await this.eventService.getEvent(args);
    return events;
  }
}

@Resolver((_type) => Editor)
export class EditorResolver {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  @Mutation((_return) => Editor)
  async edit(@Arg('input') input: EditorInput, @Ctx() context: Context) {
    const editor = await this.eventService.edit(input, context.user);

    return editor;
  }

  @Mutation((_return) => String)
  async release(@Arg('input') input: EditorInput, @Ctx() context: Context) {
    await this.eventService.release(input, context.user);
    return 'Success';
  }

  @Mutation((_return) => String)
  async maintain(@Arg('input') input: EditorInput, @Ctx() context: Context) {
    await this.eventService.maintain(input, context.user);
    return 'Success';
  }
}
