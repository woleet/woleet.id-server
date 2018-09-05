import * as uuid from 'uuid/v4';
import * as config from '../config';

function exp() {
  return config.session.expireAfter + (+new Date);
}

export class SessionStore {
  map: Map<string, Session>;

  constructor() {
    this.map = new Map;
  }

  async create(user: SequelizeUserObject): Promise<string> {
    const id = uuid();
    this.map.set(id, { id, user, exp: exp() });
    return id;
  }

  async get(id: string): Promise<Session> {
    const session = this.map.get(id);

    if (!session) {
      return null;
    }

    if (session.exp < +new Date) {
      this.map.delete(id);
      return null;
    }

    session.exp = exp();

    return session;
  }

  async del(id: string): Promise<boolean> {
    return this.map.delete(id);
  }

}

export const store = new SessionStore;
