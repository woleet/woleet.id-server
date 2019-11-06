import * as Sequelize from 'sequelize';
import { FindOptions, Instance } from 'sequelize';
import { sequelize } from '../sequelize';

export abstract class AbstractInstanceAccess<TInstance, TPost> {
  client: Sequelize.Sequelize;
  model: Sequelize.Model<Instance<TInstance>, TPost>;

  constructor() {
    this.client = sequelize;
  }

  abstract handleError(error);

  protected define(
    modelName: string,
    attributes: Sequelize.DefineModelAttributes<TPost>,
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
      const up = await this.model.findByPk(id);
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

  async getAll(opt: FindOptions<TInstance> & { full?: boolean } = {}, where = {}): Promise<Instance<TInstance>[]> {
    return this.model.findAll({
      where,
      offset: opt.offset,
      limit: opt.limit,
      order: opt.order || [['createdAt', 'DESC']],
      paranoid: !opt.full
    });
  }

  async getById(id: string): Promise<Instance<TInstance> | null> {
    return this.model.findByPk(id);
  }

  async delete(id: string): Promise<Instance<TInstance>> {
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

  async restore(id: string): Promise<Instance<TInstance>> {
    try {
      const up = await this.model.findByPk(id, { paranoid: false });
      if (!up) {
        return null;
      }

      await up.restore();
      return up;
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }
}
