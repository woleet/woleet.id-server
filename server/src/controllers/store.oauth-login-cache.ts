import { cacheLock as cacheLock } from '../cacheLock';
import * as Debug from 'debug';

const debug = Debug('id:oauthLoginCache');

type OauthLoginCacheObject = {
  state: string;
  nonce: string;
  interaction: string;
};


export class OauthLoginCache {

  oAuthExpirationSeconds = 30 * 60;

  async set(oauth: string, payload: OauthLoginCacheObject) {
    await this._setCache(oauth, payload);
  }

  async get(oauth: string): Promise<OauthLoginCacheObject> {
    const oauthLoginCacheObject = await this._getCache(oauth);
    if (!oauthLoginCacheObject) {
      return null;
    }

    return oauthLoginCacheObject;
  }

  // Get a session from the cache
  async _getCache(oauth: string): Promise<OauthLoginCacheObject> {
    let payloadJSON;
    if (cacheLock.localCache !== undefined) {
      payloadJSON = cacheLock.localCache.get(oauth);
    } else if (cacheLock.redis !== undefined) {
      payloadJSON = await cacheLock.redis.get(oauth);
    }
    let oauthLoginCacheObject: OauthLoginCacheObject;
    if (payloadJSON) {
      oauthLoginCacheObject = JSON.parse(payloadJSON);
    }
    return oauthLoginCacheObject;
  }

  // Create or update a session in the cache
  async _setCache(oauth: string, payload: OauthLoginCacheObject) {
    if (cacheLock.localCache !== undefined) {
      cacheLock.localCache.set(oauth, JSON.stringify(payload), this.oAuthExpirationSeconds);
    } else if (cacheLock.redis !== undefined) {
      await cacheLock.redis.setex(oauth, this.oAuthExpirationSeconds, JSON.stringify(payload));
    }
  }
}

export const oauthLoginCache = new OauthLoginCache;
