import { Cache } from 'lru-cache';
import * as LRU from 'lru-cache';
import { APIToken } from '../database';

export class APITokenStore {
  lru: Cache<string, SequelizeAPITokenObject>;

  constructor() {
    this.lru = new LRU();
  }

  /**
   * todo: ensure (test) that sequelize instances are updated
   */
  async get(value: string): Promise<InternalAPITokenObject> {
    let apiTokenInstance = this.lru.get(value);

    if (apiTokenInstance) {
      return apiTokenInstance.toJSON();
    }

    apiTokenInstance = await APIToken.getByValue(value);

    if (apiTokenInstance) {
      this.lru.set(value, apiTokenInstance);
      return apiTokenInstance.toJSON();
    }

    return null;
  }
}

export const store = new APITokenStore;
