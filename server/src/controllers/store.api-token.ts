import { Cache } from 'lru-cache';
import * as LRU from 'lru-cache';
import { APIToken } from '../database';

function serialize(token: SequelizeAPITokenObject): InternalTokenObject {
  const t = token.toJSON();
  return {
    id: t.id,
    exp: null,
    status: t.status,
    scope: ['signature'],
    type: 'api',
    role: 'admin',
    userId: null
  };
}

export class APITokenStore {
  lru: Cache<string, InternalTokenObject>;

  constructor() {
    this.lru = new LRU();
  }

  async get(value: string): Promise<InternalTokenObject> {
    let token = this.lru.get(value);

    if (token) {
      return token;
    }

    const apiToken = await APIToken.getByValue(value);

    if (!apiToken) {
      return null;
    }

    token = serialize(apiToken);

    this.lru.set(value, token);
    return token;
  }

  async resetCache(value: string) {
    this.lru.del(value);
  }

}

export const store = new APITokenStore;
