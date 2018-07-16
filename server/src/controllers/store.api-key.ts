import { Cache } from 'lru-cache';
import * as uuid from 'uuid/v4';
import * as LRU from 'lru-cache';

export class APIKeyStore {
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

export const store = new APIKeyStore;
