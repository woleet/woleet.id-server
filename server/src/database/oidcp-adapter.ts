import * as Sequelize from 'sequelize';
// import { models, grantable } from './model/oidcp';
import { models, grantable } from './model/oidcp';
import { sequelize } from './sequelize';
import { User } from './index';

import * as assert from 'assert';
import * as Debug from 'debug';
const debug = Debug('id:oidc:adapter');

type OptionalAttributesOf<T> = {
  [P in keyof T]?: T[P];
};

export class SequelizeAdapter {

  model: Sequelize.Model<OIDCToken, OptionalAttributesOf<OIDCToken>>;
  name: OIDCTokenEnum;

  constructor(name: OIDCTokenEnum) {
    this.model = models.get(name);
    this.name = name;
  }

  static async connect() {
    return sequelize.sync();
  }

  async upsert(id, data, expiresIn) {
    debug(`upsert ${id}`, data, expiresIn);
    await this.model.upsert({
      id,
      data,
      ...(data.grantId ? { grantId: data.grantId } : undefined),
      ...(data.userCode ? { userCode: data.userCode } : undefined),
      ...(expiresIn ? { expiresAt: new Date(Date.now() + (expiresIn * 1000)) } : undefined),
    });
  }

  async find(id) {
    debug(`find ${id}`);
    const res = this.model.findByPrimary(id).then((found) => {
      if (!found) { return undefined; }
      return {
        ...found.data,
        ...(found.consumedAt ? { consumed: true } : undefined),
      };
    });
    debug(`found `, await res);
    return res;
  }

  async findByUserCode(userCode) {
    debug(`findByUserCode ${userCode}`);
    return this.model.findOne({ where: { userCode } }).then((found) => {
      if (!found) { return undefined; }
      return {
        ...found.data,
        ...(found.consumedAt ? { consumed: true } : undefined),
      };
    });
  }

  async destroy(id) {
    debug(`destroy ${id}`);
    if (grantable.has(this.name)) {
      const { grantId } = await this.model.findByPrimary(id);
      const promises = [];
      grantable.forEach((name) => {
        promises.push(models.get(name).destroy({ where: { grantId } }));
      });
      await Promise.all(promises);
    } else {
      await this.model.destroy({ where: { id } });
    }
  }

  async consume(id) {
    debug(`consume ${id}`);
    await this.model.update({ consumedAt: new Date() }, { where: { id } });
  }
}


const store = new Map();
const logins = new Map();

export class OIDCAccount {

  constructor(id?: uuid) {
    assert(id, 'Missing id');
    debug(`OIDCAccount ${id}`);
    this.accountId = id;
    store.set(this.accountId, this);
  }

  accountId: uuid;

  static async findByLogin(login) {
    debug(`findByLogin ${login}`);
    if (!logins.get(login)) { // TODO:
      logins.set(login, new OIDCAccount());
    }

    return logins.get(login);
  }

  static async findById(ctx, id, token) {
    debug(`findById ${id}`);
    // token is a reference to the token used for which a given account is being loaded,
    //   it is undefined in scenarios where account claims are returned from authorization endpoint
    // ctx is the koa request context
    if (!store.get(id)) {
      store.set(id, new OIDCAccount(id));
    }
    return store.get(id);
  }

  /**
   * @param use - can either be "id_token" or "userinfo", depending on
   *   where the specific claims are intended to be put in.
   * @param scope - the intended scope, while oidc-provider will mask
   *   claims depending on the scope automatically you might want to skip
   *   loading some claims from external resources etc. based on this detail
   *   or not return them in id tokens but only userinfo and so on.
   */
  async claims(use, scope) { // eslint-disable-line no-unused-vars
    debug(`claims ${use} ${scope}`);

    const id = this.accountId;

    const user = await User.getById(id);

    if (!user) {
      throw new Error(`No user matches identifier ${id}`);
    }

    return {
      sub: id,
      email: user.get('email'),
      email_verified: true,
      name: user.get('x500CommonName'),
      nickname: user.get('x500UserId') || user.get('username'),
      preferred_username:  user.get('x500UserId') || user.get('username'),
      updated_at: user.get('updatedAt'),
    };
  }
}
