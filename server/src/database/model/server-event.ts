import { Instance } from 'sequelize';
import { UUID, UUIDV4, ENUM, DATE, JSON } from 'sequelize';

import { AbstractInstanceAccess } from './abstract';
import { events as eventsConfig } from '../../config';

const ServerEventModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  type: {
    type: ENUM(...eventsConfig.typesEnum),
    allowNull: false
  },
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

  async getByType(type, opt: ListOptions): Promise<Instance<InternalServerEventObject>[]> {
    console.log('TYPE', type, opt)
;    return this.model.findAll({
      where: { type },
      offset: opt.offset,
      limit: opt.limit,
      order: [['createdAt', 'DESC']],
      paranoid: !opt.full
    });
  }

}

export const ServerEvent = new ServerEventAccess();
