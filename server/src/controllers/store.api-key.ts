import { Cache } from 'lru-cache';
import * as LRU from 'lru-cache';
import { APIKey } from '../database';

export class APIKeyStore {
  lru: Cache<string, SequelizeAPIKeyObject>;

  constructor() {
    this.lru = new LRU();
  }

  /**
   * todo: ensure (test) that sequelize instances are updated
   */
  async get(id: string): Promise<InternalAPIKeyObject> {
    let apiKeyInstance = this.lru.get(id);

    if (apiKeyInstance) {
      return apiKeyInstance.toJSON();
    }

    apiKeyInstance = await APIKey.getById(id);

    if (apiKeyInstance) {
      this.lru.set(id, apiKeyInstance);
      return apiKeyInstance.toJSON();
    }

    return null;
  }
}

export const store = new APIKeyStore;
