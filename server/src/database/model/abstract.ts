import * as Sequelize from 'sequelize';

import { Instance } from 'sequelize';

export abstract class AbstractInstanceAccess<TInstance, TPost> {
  client: Sequelize.Sequelize;
  model: Sequelize.Model<Instance<TInstance>, TPost>;

  constructor(client: Sequelize.Sequelize) {
    this.client = client;
  }

  abstract handleError(error);

  protected define(
    modelName: string,
    attributes: Sequelize.DefineAttributes,
    options?: Sequelize.DefineOptions<Instance<TInstance>>
  ) {
    this.model = this.client.define<Instance<TInstance>, TPost>(modelName, attributes, options);
  }

  async create(obj: TPost): Promise<Instance<TInstance>> {
    try {
      return await this.model.create(obj);
    } catch (err) {
      this.handleError(err);
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
      this.handleError(err);
      throw err;
    }
  }

  async getAll({ offset = 0, limit = 100 } = {}): Promise<Instance<TInstance>[]> {
    return this.model.findAll({ offset, limit, order: [["id", "ASC"]] });
  }

  async getById(id: string): Promise<Instance<TInstance> | null> {
    return this.model.findById(id);
  }

}
