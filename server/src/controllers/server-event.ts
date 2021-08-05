import { ServerEvent } from '../database';

import * as Debug from 'debug';
import * as log from 'loglevel';
import { events as config } from '../config';

const debug = Debug('id:events');

export class EventStore {

  private batch: Array<ServerEventCreate>;

  private timer: NodeJS.Timer;

  constructor() {
    this.timer = null;
    this.batch = [];
  }

  register(evt: ServerEventCreate): void {
    const event = {
      type: evt.type,
      data: evt.data,
      authorizedUserId: evt.authorizedUserId,
      authorizedTokenId: evt.authorizedTokenId,
      associatedTokenId: evt.associatedTokenId,
      associatedUserId: evt.associatedUserId,
      associatedKeyId: evt.associatedKeyId,
      occurredAt: new Date
    };

    debug('Registering event', event);

    const len = this.batch.push(event);
    if (len >= config.batchSize) {
      this.flush();
    } else if (!this.timer) {
      debug('Set timer');
      this.timer = setTimeout(() => this.flush(), config.flushAfter);
    }
  }

  flush() {
    clearTimeout(this.timer);
    this.timer = null;

    const len = this.batch.length;

    debug(`Flushing ${len} events`);

    ServerEvent.createMany(this.batch)
      .then((e) => {
        this.batch.splice(0, len);
      })
      .catch((err) => {
        log.error(err);
      });
  }
}

export const store = new EventStore;
