import { Cache } from 'lru-cache';
import * as LRU from 'lru-cache';
import * as uuid from 'uuid/v4';

import { session as config } from '../config';

function exp() {
  return config.expireAfter + (+new Date);
}

export class SessionStore {
  map: Cache<string, Session>;

  constructor() {
    this.map = new LRU({ maxAge: config.maxAge });
  }

  async create(user: SequelizeUserObject): Promise<string> {
    const id = uuid();
    this.map.set(id, { id, user, exp: exp() });
    return id;
  }

  async get(id: string): Promise<Session> {
    const session = this.map.get(id);

    if (!session) {
      return null;
    }

    if (session.exp < +new Date) {
      this.map.del(id);
      return null;
    }

    session.exp = exp();

    return session;
  }

  async del(id: string): Promise<void> {
    return this.map.del(id);
  }

}

export const store = new SessionStore;
