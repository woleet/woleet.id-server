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
      indexes: [{ fields: ['occurredAt'] }],
      timestamps: false
    });
  }

  handleError(err: any) {
  }

  async createMany(events: ServerEventCreate[]): Promise<Instance<InternalServerEventObject>[]> {
    return this.model.bulkCreate(events);
  }
}

export const ServerEvent = new ServerEventAccess();
