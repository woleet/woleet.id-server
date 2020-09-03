import * as uuid from 'uuid/v4';
import * as Redis from 'ioredis';
import * as log from 'loglevel';

import { session as config } from '../config';
import { cacheConfig as cacheConfig } from '../config';
import { production } from '../config';

import * as Debug from 'debug';

const debug = Debug('id:sessions');

function exp() {
  return config.expireAfter + (+new Date);
}

export class SessionStore {
  cachePrefix = 'cache_';
  ussPrefix = 'uss_';
  redis: Redis;

  constructor() {
      this.redis = new Redis(cacheConfig.port, cacheConfig.host);
      if (!production) {
        log.info('Flushing Redis as development mode is set');
        this.redis.flushall().then(() => {
          log.info('Flushing Redis done');
        });
      }
  }
  async create(user: SequelizeUserObject): Promise<string> {
    const id = uuid();
    const userId = user.get('id');
    const userRole = user.get('role');
    const session = { id, exp: exp(), userId, userRole };

    this.setSession(id, session);

    let sessionSet = await this.getUSS(userId);

    sessionSet.add(session);

    await this.setUSS(userId, sessionSet);

    return id;
  }

  async get(sessionId: string): Promise<Session> {
    const session = await this.getSession(sessionId);

    if (!session) {
      return null;
    }

    if (session.exp < +new Date) {
      this.delSession(sessionId);
      return null;
    }

    // Report expiration date;
    session.exp = exp();
    this.setSession(sessionId, session);
    return session;
  }

  async del(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);

    debug('Deleting session', sessionId);

    this.delSession(sessionId);

    this._delSessionInUSS(session);
  }

  private async _delSessionInUSS(session: Session) {
    const sessionSet = await this.getUSS(session.userId);
    sessionSet.delete(session);
    this.setUSS(session.userId, sessionSet);
  }

  async delSessionsWithUser(userId: string): Promise<void> {
    const sessionSet = await this.getUSS(userId);

    debug('Deleting sessions of user', userId);

    if (!sessionSet) {
      return;
    }

    sessionSet.forEach(session => {
      this.delSession(session.id);
    });

    sessionSet.clear();
    this.setUSS(userId, sessionSet);
  }

  async getSession(id: string): Promise<Session> {
    const sessionJSON = await this.redis.get(this.cachePrefix + id);
    let session: Session;
    if (sessionJSON) {
      session = JSON.parse(sessionJSON);
    }
    return session;
  }

  async getUSS(userId: string): Promise<Set<Session>> {
    const sessionSetJSON = await this.redis.get(this.ussPrefix + userId);
    let sessionSet: Set<Session> = new Set<Session>();
    if (sessionSetJSON) {
      sessionSet = JSON.parse(sessionSetJSON);
    }
    return sessionSet;
  }

  async setSession(id: string, session: Session) {
    this.redis.set(this.cachePrefix + id, JSON.stringify(session));
  }

  async setUSS(userId: string, sessionSet: Set<Session>) {
    this.redis.set(this.ussPrefix + userId, JSON.stringify(sessionSet));
  }

  async delSession(id: string) {
    this.redis.del(this.cachePrefix + id);
  }

  async delUSS(userId: string) {
    this.redis.del(this.ussPrefix + userId);
  }

}

export const store = new SessionStore;
