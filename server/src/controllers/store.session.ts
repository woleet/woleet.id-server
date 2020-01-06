import * as LRU from 'lru-cache';
import { Cache } from 'lru-cache';
import * as uuid from 'uuid/v4';

import { session as config } from '../config';

import * as Debug from 'debug';

const debug = Debug('id:sessions');

function exp() {
  return config.expireAfter + (+new Date);
}

export class SessionStore {
  cache: Cache<string, Session>;

  // User-Sessions-Set (uss)
  // Data structure to link a user to a set of active sessions
  uss: Map<string, Set<Session>>;

  constructor() {
    this.uss = new Map<string, Set<Session>>();
    this.cache = new LRU({
      maxAge: config.maxAge,
      dispose: (sessionId, session) => {
        debug('Cache disposing session', sessionId);
        this._delSessionInUSS(session);
      }
    });
  }

  async create(user: SequelizeUserObject): Promise<string> {
    const id = uuid();
    const userId = user.get('id');
    const session = { id, user, exp: exp() };

    this.cache.set(id, session);

    if (this.uss.has(userId)) {
      this.uss.get(userId).add(session);
    } else {
      const sessionSet = new Set<Session>();
      sessionSet.add(session);
      this.uss.set(userId, sessionSet);
    }

    return id;
  }

  async get(sessionId: string): Promise<Session> {
    const session = this.cache.get(sessionId);

    if (!session) {
      return null;
    }

    if (session.exp < +new Date) {
      this.cache.del(sessionId);
      return null;
    }

    // Report expiration date;
    session.exp = exp();

    return session;
  }

  async del(sessionId: string): Promise<void> {
    const session = this.cache.get(sessionId);

    if (!session) {
      return;
    }

    debug('Deleting session', sessionId);

    this.cache.del(sessionId);

    this._delSessionInUSS(session);
  }

  private _delSessionInUSS(session: Session) {

    const userId = session.user.get('id');

    const sessionSet = this.uss.get(userId);

    sessionSet.delete(session);
  }

  async delSessionsWithUser(userId: string): Promise<void> {
    const sessionSet = this.uss.get(userId);

    debug('Deleting sessions of user', userId);

    if (!sessionSet) {
      return;
    }

    sessionSet.forEach(s => this.cache.del(s.id));

    sessionSet.clear();
  }

}

export const store = new SessionStore;
