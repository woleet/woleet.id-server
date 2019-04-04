import { Cache } from 'lru-cache';
import * as LRU from 'lru-cache';
import * as crypto from 'crypto';
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

  async getByValue(value: string): Promise<InternalTokenObject> {
    try {
      const bin = Buffer.from(value, 'base64');
      const hash = crypto.createHash('sha256').update(bin).digest('hex');
      return this.getByHash(hash);
    } catch (err) {
      return null;
    }
  }

  async getByHash(hash: string): Promise<InternalTokenObject> {
    let token = this.lru.get(hash);

    if (token) {
      return token;
    }

    const apiToken = await APIToken.getByHash(hash);

    if (!apiToken) {
      return null;
    }

    token = serialize(apiToken);

    this.lru.set(hash, token);
    return token;
  }

  async resetCache(hash: string) {
    this.lru.del(hash);
  }

}

export const store = new APITokenStore;
