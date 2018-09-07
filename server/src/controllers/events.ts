import { ServerEvent } from '../database';

import * as Debug from 'debug';
import * as log from 'loglevel';

const debug = Debug('id:events');

const _limit = 10;

export class EventStore {

  batch: Array<ServerEventCreate>;

  constructor() {
    this.batch = [];
  }

  register(evt: ServerEventCreate): void {
    const event = {
      type: evt.type,
      data: evt.data,
      authorizedUserId: evt.authorizedUserId,
      associatedTokenId: evt.associatedTokenId,
      associatedUserId: evt.associatedUserId,
      associatedkeyId: evt.associatedUserId,
      occurredAt: new Date
    };

    debug('Registering event', event);

    const len = this.batch.push(event);

    if (!(len % _limit)) {
      this.flush();
    }
  }

  flush() {

    const len = this.batch.length;

    debug(`Flushing ${len} events`);

    ServerEvent.createMany(this.batch)
      .then((e) => {
        debug('Registered', e);
        this.batch.splice(0, len);
      })
      .catch((err) => {
        log.error('APIEven error:', err);
      });

  }

}

export const store = new EventStore;

export async function getServerEventById(id: string)
  : Promise<InternalServerEventObject> {
  const event = await ServerEvent.getById(id);
  return event.toJSON();
}

export async function getServerEventListByType(type: ServerEventTypeEnum, { offset = 0, limit = 100, full = false } = {})
  : Promise<InternalServerEventObject[]> {
  const events = await ServerEvent.getByType(type, { offset, limit, full });
  return events.map((evt) => evt.toJSON());
}

export async function getAllServerEvents({ offset = 0, limit = 100, full = false } = {})
  : Promise<InternalServerEventObject[]> {
  const events = await ServerEvent.getAll({ offset, limit, full });
  return events.map((evt) => evt.toJSON());
}
