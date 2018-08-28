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
  async get(id: string): Promise<InternalAPITokenObject> {
    let apiTokenInstance = this.lru.get(id);

    if (apiTokenInstance) {
      return apiTokenInstance.toJSON();
    }

    apiTokenInstance = await APIToken.getById(id);

    if (apiTokenInstance) {
      this.lru.set(id, apiTokenInstance);
      return apiTokenInstance.toJSON();
    }

    return null;
  }
}

export const store = new APITokenStore;
