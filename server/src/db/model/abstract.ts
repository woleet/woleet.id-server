import * as Sequelize from 'sequelize';

import { UniqueConstraintError, Instance } from 'sequelize';
import { DuplicatedUserError } from '../../errors';

export abstract class AbstractInstanceAccess<TInstance, TPost> {
  client: Sequelize.Sequelize;
  model: Sequelize.Model<Instance<TInstance>, TPost>;

  constructor(client: Sequelize.Sequelize) {
    this.client = client;
  }

  protected init(
    modelName: string,
    attributes: Sequelize.DefineAttributes,
    options?: Sequelize.DefineOptions<Instance<TInstance>>
  ) {
    this.model = this.client.define<Instance<TInstance>, TPost>(modelName, attributes, options);
  }

  async create(obj: TPost): Promise<Instance<TInstance>> {
    try {
      const u = await this.model.create(obj);
      console.info('Created', JSON.stringify(u));
      return u;
    } catch (err) {

      if (err instanceof UniqueConstraintError) {
        const field = Object.keys(err['fields']);
        throw new DuplicatedUserError(`Duplicated field ${field}`, err);
      }

      throw err;
    }
  }

  async update(id: string, attrs): Promise<Instance<TInstance>> {
    try {
      const up = await this.model.findById(id);

      if (!up)
        return null;

      await up.updateAttributes(attrs);

      return up;
    } catch (err) {

      if (err instanceof UniqueConstraintError) {
        const field = Object.keys(err['fields']);
        throw new DuplicatedUserError(`Duplicated field ${field}`, err);
      }

      throw err;
    }
  }

  async getAll(): Promise<Instance<TInstance>[]> {
    return this.model.findAll()
  }

  async getById(id: string): Promise<Instance<TInstance> | null> {
    return this.model.findById(id)
  }

}
