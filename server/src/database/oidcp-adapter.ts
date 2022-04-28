import { Model, ModelCtor } from 'sequelize';
import { grantable, models } from './model/oidcp';
import { sequelize } from './sequelize';
import { User } from './index';

import * as assert from 'assert';
import * as Debug from 'debug';
import { OIDCToken, OIDCTokenEnum, UUID } from '../types';

const debug = Debug('id:oidc:adapter');

type OptionalAttributesOf<T> = {
  [P in keyof T]?: T[P];
};

// Original source: https://github.com/panva/node-oidc-provider/blob/v7.x/example/adapters/contributed/sequelize.js
export class SequelizeAdapter {

  model: ModelCtor<Model<OIDCToken, OptionalAttributesOf<OIDCToken>>>;
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
      ...(data.uid ? { uid: data.uid } : undefined),
      ...(expiresIn ? { expiresAt: new Date(Date.now() + (expiresIn * 1000)) } : undefined),
    });
  }

  find(id) {
    debug(`find ${id}`);
    return this.model.findByPk(id)
      .then((found) => {
        if (!found) {
          return undefined;
        }
        return {
          ...found.getDataValue('data'),
          ...(found.getDataValue('consumedAt') ? { consumed: true } : undefined),
        };
      })
      .then((res) => {
        debug('found ', res);
        return res;
      });
  }

  findByUserCode(userCode) {
    debug(`findByUserCode ${userCode}`);
    return this.model.findOne({ where: { userCode } }).then((found) => {
      if (!found) {
        return undefined;
      }
      return {
        ...found.getDataValue('data'),
        ...(found.getDataValue('consumedAt') ? { consumed: true } : undefined),
      };
    });
  }

  findByUid(uid) {
    debug(`findByUid ${uid}`);
    return this.model.findOne({ where: { data: { uid } } }).then((found) => {
      if (!found) {
        return undefined;
      }
      return {
        ...found.getDataValue('data'),
        ...(found.getDataValue('consumedAt') ? { consumed: true } : undefined),
      };
    });
  }

  async destroy(id) {
    debug(`destroy ${id}`);
    if (grantable.has(this.name)) {
      const found = await this.model.findByPk(id);
      const grantId = found.getDataValue('grantId');
      const promises = [];
      grantable.forEach((name) => {
        promises.push(models.get(name).destroy({ where: { grantId } }));
      });
      await Promise.all(promises);
    } else {
      await this.model.destroy({ where: { id } });
    }
  }

  async revokeByGrantId(grantId) {
    debug(`revoke ${grantId}`);
    const promises = [];
    grantable.forEach((name) => {
      promises.push(models.get(name).destroy({ where: { grantId } }));
    });
    await Promise.all(promises);
  }

  async consume(id) {
    debug(`consume ${id}`);
    await this.model.update({ consumedAt: new Date() }, { where: { id } });
  }
}

const store = new Map();

export class OIDCAccount {

  constructor(id?: UUID) {
    assert(id, 'Missing id');
    debug(`OIDCAccount ${id}`);
    this.accountId = id;
    store.set(this.accountId, this);
  }

  accountId: UUID;

  static async findAccount(ctx, id, token) {
    // token is a reference to the token used for which a given account is being loaded,
    //   it is undefined in scenarios where account claims are returned from authorization endpoint
    // ctx is the koa request context
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
  async claims(use, scope) {
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
      preferred_username: user.get('username'),
      updated_at: user.get('updatedAt'),
    };
  }
}
