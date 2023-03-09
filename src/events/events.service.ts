import { AppDataSource } from '../core/database';
import { logger } from '../core/utils/logger.util';
import { Voucher } from '../vouchers/vouchers.schema';
import { Event, CreateEventInput, EventsArgs } from './events.schema';

export class EventService {
  private eventRepo = AppDataSource.getRepository(Event);

  async create(createEventInput: CreateEventInput): Promise<Event> {
    logger.info(JSON.stringify(createEventInput));

    const newEvent = new Event(createEventInput);
    newEvent.quantity = newEvent.maximum;
    await this.eventRepo.save(newEvent);

    return newEvent;
  }

  async getEvent({ skip, take }: EventsArgs): Promise<Event[]> {
    const result = await this.eventRepo.find({ skip, take });
    return result;
  }

  async getEventField(voucher: Voucher): Promise<Event | null> {
    const resutlt = await this.eventRepo.findOne({ where: { id: voucher.eventId } });

    return resutlt;
  }
}
