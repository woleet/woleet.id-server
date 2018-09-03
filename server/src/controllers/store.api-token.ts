import { Cache } from 'lru-cache';
import * as LRU from 'lru-cache';
import { APIToken } from '../database';

export class APITokenStore {
  lru: Cache<string, SequelizeAPITokenObject>;

  constructor() {
    this.lru = new LRU();
  }

  async get(value: string): Promise<InternalAPITokenObject> {
    let apiTokenInstance = this.lru.get(value);

    if (apiTokenInstance) {
      return apiTokenInstance.toJSON();
    }

    apiTokenInstance = await APIToken.getByValue(value);

    if (!apiTokenInstance) {
      return null;
    }

    this.lru.set(value, apiTokenInstance);
    return apiTokenInstance.toJSON();
  }

  async resetCache(value: string) {
    this.lru.del(value);
  }

}

export const store = new APITokenStore;
