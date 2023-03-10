import { ApolloError, UserInputError } from 'apollo-server-core';
import { LessThan, MoreThan } from 'typeorm';
import { AppDataSource } from '../core/connection/database';
import { EDIT_EXP_TIME } from '../core/constant';
import { logger } from '../core/utils/logger.util';
import { User } from '../users/users.schema';
import { Voucher } from '../vouchers/vouchers.schema';
import { Event, CreateEventInput, EventsArgs, Editor, EditorInput } from './events.schema';

export class EventService {
  private eventRepo = AppDataSource.getRepository(Event);
  private editorRepo = AppDataSource.getRepository(Editor);

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
    //eager load, lazy load
    const event = await this.eventRepo.findOne({ where: { id: voucher.eventId } });
    await event?.editor;
    return event;
  }

  async revertEvent(eventId: number): Promise<void> {
    await this.eventRepo.increment({ id: eventId, quantity: MoreThan(0) }, 'quantity', 1);
  }

  async edit({ eventId }: EditorInput, user: User): Promise<Editor> {
    const editExpireTimeMs = EDIT_EXP_TIME * 1000;

    await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      const editor = await transactionalEntityManager.findOne(Editor, { where: { eventId } });
      if (!editor) {
        await transactionalEntityManager.insert(Editor, {
          eventId,
          userId: user.id,
          expiredAt: new Date(Date.now() + editExpireTimeMs),
        });
      } else {
        const editing = await transactionalEntityManager.update(
          Editor,
          { eventId, expiredAt: LessThan(new Date()) },
          { userId: user.id, expiredAt: new Date(Date.now() + editExpireTimeMs) },
        );

        if (editor.userId != user.id && !editing.affected) {
          throw new ApolloError("You can't edit this event", 'SQL_CONFLICT_ERROR');
        }
      }
    });

    const result = await AppDataSource.manager.findOne(Editor, { where: { eventId } });
    if (!result) {
      throw new UserInputError('Event not found ');
    }
    return result;
  }

  async release({ eventId }: EditorInput, user: User): Promise<void> {
    const editing = await this.editorRepo.delete({ eventId, userId: user.id });

    if (!editing.affected) {
      throw new ApolloError("You can't release this event", 'SQL_CONFLICT_ERROR');
    }
  }

  async maintain({ eventId }: EditorInput, user: User): Promise<void> {
    const editExpireTimeMs = EDIT_EXP_TIME * 1000;

    const editing = await this.editorRepo.update(
      { eventId, userId: user.id },
      { userId: user.id, expiredAt: new Date(Date.now() + editExpireTimeMs) },
    );

    if (!editing.affected) {
      throw new ApolloError("You can't maintain this event", 'BAD_REQUEST');
    }
  }
}
