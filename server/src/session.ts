import { Cache } from 'lru-cache';
import * as uuid from 'uuid/v4';
import * as LRU from 'lru-cache';
import { SequelizeUserObject, Session } from './typings';
import { BadRequest } from 'http-errors';

export class SessionStore {
  lru: Cache<string, Session>;

  constructor() {
    this.lru = new LRU;
  }

  async create(user: SequelizeUserObject, ttl: number = 60 * 60 * 1000): Promise<string> {
    const id = uuid();
    this.lru.set(id, { id, user });
    return id;
  }

  async get(id: string): Promise<Session> {
    return this.lru.get(id) || null;
  }

  async del(id: string): Promise<void> {
    return this.lru.del(id);
  }

}

export const store = new SessionStore;

export default async function (ctx, next) {
  ctx.sessions = store;
  const { header } = ctx.request;
  if (header && header.authorization) {
    const parts = header.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const sid = parts[1];
      ctx.session = await store.get(sid);
    } else {
      throw new BadRequest('Invalid token');
    }
  }

  return next();
};
