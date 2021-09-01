import { FindOptions, Sequelize, Model, ModelAttributes, ModelOptions, ModelCtor } from 'sequelize';
import { sequelize } from '../sequelize';

export abstract class AbstractInstanceAccess<TAttribute, TPost> {
  client: Sequelize;
  model: ModelCtor<Model<TAttribute, TPost>>;

  constructor() {
    this.client = sequelize;
  }

  abstract handleError(error);

  protected define(
    modelName: string,
    attributes: ModelAttributes<Model<TAttribute, TPost>, TPost>,
    options?: ModelOptions<Model<TAttribute, TPost>>
  ) {
    this.model = this.client.define(modelName, attributes, options);
  }

  async create(obj: TPost): Promise<Model<TAttribute, TPost>> {
    try {
      return await this.model.create(obj);
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }

  async update(keys, attrs): Promise<Model<TAttribute, TPost>> {
    try {
      const up = await this.model.findByPk(keys);
      if (!up) {
        return null;
      }

      await up.update(attrs);
      return up;
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }

  async getAll(opts: FindOptions<any> = {}): Promise<Model<TAttribute, TPost>[]> {

    // By default, sort object from the newest to the oldest
    if (!opts.order) {
      opts.order = [['createdAt', 'DESC']];
    }

    return this.model.findAll(opts);
  }

  async getById(id: string): Promise<Model<TAttribute, TPost> | null> {
    return this.model.findByPk(id);
  }

  async delete(id: string): Promise<Model<TAttribute, TPost>> {
    try {
      const up = await this.model.findByPk(id);
      if (!up) {
        return null;
      }

      await up.destroy();
      return up;
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }

  async restore(): Promise<void> {
    try {
      await this.model.restore();
      return;
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }
}
