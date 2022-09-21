import * as LRU from 'lru-cache';
import { Cache } from 'lru-cache';

import { getProvider } from './oidc-provider';
import { logger } from '../config';
import { InternalOauthTokenObject, InternalTokenObject } from '../types';

function serialize(token: InternalOauthTokenObject): InternalTokenObject {
  return {
    id: token.jti,
    exp: token.exp * 1000,
    status: 'active',
    scope: token.scope.split(' '),
    type: 'oauth',
    role: 'user',
    userId: token.accountId
  };
}

function checkExp(token) {
  if (token.exp < (+new Date())) {
    token.status = 'expired';
  }
  return token;
}

export class OauthAccessTokenStore {
  lru: Cache<string, InternalTokenObject>;

  constructor() {
    this.lru = new LRU();
  }

  async get(value: string): Promise<InternalTokenObject> {
    let token = this.lru.get(value);

    if (token) {
      return checkExp(token);
    }

    const accessToken: InternalOauthTokenObject = await getProvider().AccessToken.find(value);
    if (!accessToken) {
      logger.warn(`Attempt to log in with invalid token ${value}`);
      return null;
    }

    token = serialize(accessToken);

    if (!token) {
      return null;
    }

    this.lru.set(value, token);
    return checkExp(token);
  }

  async resetCache(value: string) {
    this.lru.del(value);
  }

}

export const store = new OauthAccessTokenStore;
