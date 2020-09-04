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

    const ussArray = await this.getUSS(userId);
    ussArray.push(session.id);
    await this.setUSS(userId, ussArray);

    return id;
  }

  async get(sessionId: string): Promise<Session> {
    const session = await this.getSession(sessionId);

    if (!session) {
      return null;
    }

    if (session.exp < +new Date) {
      this.del(sessionId);
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
    const ussArray = await this.getUSS(session.userId);
    const ussIndexToDelete = ussArray.findIndex(elem => (elem === session.id));
    if (ussIndexToDelete !== -1) {
      ussArray.splice(ussIndexToDelete, 1);
      this.setUSS(session.userId, ussArray);
    }
  }

  async delSessionsWithUser(userId: string): Promise<void> {
    const ussArray = await this.getUSS(userId);

    debug('Deleting sessions of user', userId);

    if (!ussArray) {
      return;
    }

    ussArray.forEach(sessionId => {
      this.delSession(sessionId);
    });

    this.setUSS(userId, new Array());
  }

  async getSession(id: string): Promise<Session> {
    const sessionJSON = await this.redis.get(this.cachePrefix + id);
    let session: Session;
    if (sessionJSON) {
      session = JSON.parse(sessionJSON);
    }
    return session;
  }

  async getUSS(userId: string): Promise<Array<string>> {
    const ussArrayJSON = await this.redis.get(this.ussPrefix + userId);
    let ussArray = [];
    if (ussArrayJSON) {
      ussArray = JSON.parse(ussArrayJSON);
    }
    return ussArray;
  }

  async setSession(id: string, session: Session) {
    this.redis.set(this.cachePrefix + id, JSON.stringify(session));
  }

  async setUSS(userId: string, ussArray: Array<string>) {
    this.redis.set(this.ussPrefix + userId, JSON.stringify(ussArray));
  }

  async delSession(id: string) {
    this.redis.del(this.cachePrefix + id);
  }

  async delUSS(userId: string) {
    this.redis.del(this.ussPrefix + userId);
  }
}

export const store = new SessionStore;
