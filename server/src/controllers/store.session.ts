import * as uuid from 'uuid/v4';
import * as Redis from 'ioredis';
import * as NodeCache from 'node-cache';

import { session as config } from '../config';
import { cacheConfig as cacheConfig } from '../config';
import { exit } from '../exit';

import * as Debug from 'debug';

const debug = Debug('id:sessions');

export class SessionStore {
  redis: Redis = undefined;
  localCache: NodeCache = undefined;

  constructor() {
    switch (cacheConfig.type) {
      case 'local': {
        this.localCache = new NodeCache();
        break;
      }
      case 'redis': {
        this.redis = new Redis(cacheConfig.port, cacheConfig.host);
        break;
      }
      default: {
        exit(`Invalid cache type: ${cacheConfig.type}`, '');
        break;
      }
    }
  }

  async create(user: SequelizeUserObject): Promise<string> {
    const userId = user.get('id');
    const userRole = user.get('role');

    // sessionId is the userId concatenated with % and a random string
    const id = userId + '%' + uuid();

    // userId is not set in the session object it will be infered from the sessionId.
    const session = { userRole };

    this._setSession(id, session);

    return id;
  }

  async get(sessionId: string): Promise<Session> {
    const session = await this._getSession(sessionId);

    if (!session) {
      return null;
    }

    // Report expiration date;
    this._setSession(sessionId, session);

    // Infers userId from sessionId and delete session if none is found
    // Sets the userId in the session object to be able to use it in the application
    session.userId = sessionId.split('%')[0];
    if (!session.userId) {
      this.del(sessionId);
      return null;
    }
    session.id = sessionId;
    return session;
  }

  async del(sessionId: string): Promise<void> {
    await this._delSession(sessionId);
  }

  // Used to delete all sessions of a specified user
  // Basically search in the session storage evey keys that begin with the userId and proceeeds to delete it
  async delSessionsWithUser(userId: string): Promise<void> {
    debug('Deleting sessions of user', userId);
    if (this.localCache !== undefined) {
      this.localCache.keys().forEach(key => {
        if (key.startsWith(userId)) {
          this._delSession(userId);
        }
      });
    } else if (this.redis !== undefined) {
      const stream = this.redis.scanStream({match: `${userId}+*`});
      stream.on('data', (resultKeys) => {
        resultKeys.array.forEach(element => {
          this._delSession(element);
        });
      });
      return new Promise (function(resolve) {
        stream.on('end', () => resolve());
      });
    }
  }

  async _getSession(sessionId: string): Promise<Session> {
    let sessionJSON;
    if (this.localCache !== undefined) {
      sessionJSON = this.localCache.get(sessionId);
    } else if (this.redis !== undefined) {
      sessionJSON = await this.redis.get(sessionId);
    }
    let session: Session;
    if (sessionJSON) {
      session = JSON.parse(sessionJSON);
    }
    return session;
  }

  async _setSession(sessionId: string, session: Session) {
    if (this.localCache !== undefined) {
      this.localCache.set(sessionId, JSON.stringify(session), config.expireAfter / 1000);
    } else if (this.redis !== undefined) {
      await this.redis.setex(sessionId, config.expireAfter / 1000, JSON.stringify(session));
    }
  }

  async _delSession(sessionId: string) {
    if (this.localCache !== undefined) {
      this.localCache.del(sessionId);
    } else if (this.redis !== undefined) {
      await this.redis.del(sessionId);
    }
  }
}

export const store = new SessionStore;
