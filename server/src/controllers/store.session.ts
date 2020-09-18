import * as uuid from 'uuid/v4';

import { session as config } from '../config';
import { cacheLock as cacheLock} from '../cacheLock';

import * as Debug from 'debug';

const debug = Debug('id:sessions');

export class SessionStore {

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
    if (cacheLock.localCache !== undefined) {
      cacheLock.localCache.keys().forEach(key => {
        if (key.startsWith(userId)) {
          this._delSession(userId);
        }
      });
    } else if (cacheLock.redis !== undefined) {
      const stream = cacheLock.redis.scanStream({match: `${userId}*`});
      stream.on('data', (resultKeys) => {
        if (resultKeys) {
          resultKeys.forEach(element => {
            this._delSession(element);
          });
        }
      });
      return new Promise (function(resolve) {
        stream.on('end', () => resolve());
      });
    }
  }

  // Get a session from a sessionId from the cache
  async _getSession(sessionId: string): Promise<Session> {
    let sessionJSON;
    if (cacheLock.localCache !== undefined) {
      sessionJSON = cacheLock.localCache.get(sessionId);
    } else if (cacheLock.redis !== undefined) {
      sessionJSON = await cacheLock.redis.get(sessionId);
    }
    let session: Session;
    if (sessionJSON) {
      session = JSON.parse(sessionJSON);
    }
    return session;
  }

    // Create or update a session in the cache
  async _setSession(sessionId: string, session: Session) {
    if (cacheLock.localCache !== undefined) {
      cacheLock.localCache.set(sessionId, JSON.stringify(session), config.expireAfter / 1000);
    } else if (cacheLock.redis !== undefined) {
      await cacheLock.redis.setex(sessionId, config.expireAfter / 1000, JSON.stringify(session));
    }
  }

    // Destroy a session in the cache from the sessionId
    async _delSession(sessionId: string) {
    if (cacheLock.localCache !== undefined) {
      cacheLock.localCache.del(sessionId);
    } else if (cacheLock.redis !== undefined) {
      await cacheLock.redis.del(sessionId);
    }
  }
}

export const store = new SessionStore;
