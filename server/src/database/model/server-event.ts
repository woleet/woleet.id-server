import { DATE, ENUM, Instance, JSON, UUID, UUIDV4 } from 'sequelize';

import { AbstractInstanceAccess } from './abstract';
import { events as eventsConfig } from '../../config';

const ServerEventModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  type: {
    type: ENUM(...eventsConfig.typesEnum),
    allowNull: false
  },
  associatedTokenId: { type: UUID },
  authorizedTokenId: { type: UUID },
  associatedUserId: { type: UUID },
  authorizedUserId: { type: UUID },
  associatedKeyId: { type: UUID },
  occurredAt: { type: DATE, allowNull: false },
  data: { type: JSON, defaultValue: null }
};

class ServerEventAccess extends AbstractInstanceAccess<InternalServerEventObject, ServerEventCreate> {

  constructor() {
    super();
    this.define('serverEvent', ServerEventModel, {
      paranoid: false,
      indexes: [{ fields: ['occurredAt'] }],
      timestamps: false
    });
  }

  handleError(err: any) {
  }

  async createMany(evts: ServerEventCreate[]): Promise<Instance<InternalServerEventObject>[]> {
    return this.model.bulkCreate(evts);
  }

  async getByType(type, opt: ListOptions): Promise<Instance<InternalServerEventObject>[]> {
    return this.model.findAll({
      where: { type },
      offset: opt.offset,
      limit: opt.limit,
      order: [['occurredAt', 'DESC']],
      paranoid: !opt.full
    });
  }

}

export const ServerEvent = new ServerEventAccess();
