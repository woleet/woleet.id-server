import { Instance } from 'sequelize';
import { UUID, UUIDV4, ENUM, DATE, JSON } from 'sequelize';

import { AbstractInstanceAccess } from './abstract';

const ServerEventModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  type: { type: ENUM('signature'), allowNull: false },
  occurredAt: { type: DATE, allowNull: false },
  data: { type: JSON, defaultValue: null }
};

class ServerEventAccess extends AbstractInstanceAccess<InternalServerEventObject, ServerEventCreate> {

  constructor() {
    super();
    this.define('serverEvent', ServerEventModel, { paranoid: false });
  }

  handleError(err: any) { }

  async createMany(evts: ServerEventCreate[]): Promise<Instance<InternalServerEventObject>[]> {
    return this.model.bulkCreate(evts);
  }

  async getByType(type, { offset = 0, limit = 100, full = false } = {}): Promise<Instance<InternalServerEventObject>[]> {
    return this.model.findAll({ where: { type }, offset, limit, /*order: [['createdAt', 'ASC']],*/ paranoid: !full });
  }

}

export const ServerEvent = new ServerEventAccess();
