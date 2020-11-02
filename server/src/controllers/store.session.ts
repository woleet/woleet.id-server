import * as uuid from 'uuid/v4';
import { session as config } from '../config';
import { cacheLock as cacheLock } from '../cacheLock';
import * as Debug from 'debug';

const debug = Debug('id:sessions');

export class SessionStore {

  async create(user: SequelizeUserObject): Promise<string> {
    const userId = user.get('id');
    const userRole = user.get('role');

    // Session identifier is built from the user identifier concatenated with % and a random string
    const sessionId = userId + '%' + uuid();

    // Create session object
    await this._setSession(sessionId, { id: sessionId, userId, userRole });

    return sessionId;
  }

  async get(sessionId: string): Promise<Session> {

    // Get session
    const session = await this._getSession(sessionId);
    if (!session) {
      return null;
    }

    // Refresh expiration date
    await this._setSession(sessionId, session);

    return session;
  }

  async del(sessionId: string): Promise<void> {
    await this._delSession(sessionId);
  }

  // Delete all the sessions of a specified user
  // (search in the session storage every keys beginning with the user identifier and delete it)
  async delSessionsWithUser(userId: string): Promise<void> {
    debug('Deleting sessions of user', userId);
    if (cacheLock.localCache !== undefined) {
      cacheLock.localCache.keys().forEach(key => {
        if (key.startsWith(userId)) {
          this._delSession(userId);
        }
      });
    } else if (cacheLock.redis !== undefined) {
      const stream = cacheLock.redis.scanStream({ match: `${userId}*` });
      stream.on('data', (resultKeys) => {
        if (resultKeys) {
          resultKeys.forEach(element => {
            this._delSession(element);
          });
        }
      });
      return new Promise(function (resolve) {
        stream.on('end', () => resolve());
      });
    }
  }

  // Get a session from the cache
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

  // Destroy a session from the cache
  async _delSession(sessionId: string) {
    if (cacheLock.localCache !== undefined) {
      cacheLock.localCache.del(sessionId);
    } else if (cacheLock.redis !== undefined) {
      await cacheLock.redis.del(sessionId);
    }
  }
}

export const store = new SessionStore;
