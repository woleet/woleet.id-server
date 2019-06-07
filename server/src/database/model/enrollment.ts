import { UniqueConstraintError, UUID, UUIDV4, DATE, ENUM, STRING } from 'sequelize';
import { DuplicatedUserError } from '../../errors';
import { AbstractInstanceAccess } from './abstract';

const EnrollmentModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  userId: { type: UUID },
  expiration: { type: DATE },
  name: { type: STRING, allowNull: false },
  device: { type: ENUM(['server', 'nano', 'mobile']), allowNull: true }
};

class EnrollmentAccess extends AbstractInstanceAccess<InternalEnrollmentObject, ApiPostEnrollmentObject> {

  constructor() {
    super();
    this.define('enrollment', EnrollmentModel, { paranoid: false });
  }

  async getById(id: string): Promise<SequelizeEnrollmentObject> {
    return this.model.findOne({ where: { id } });
  }

  handleError(err: any) {
    if (err instanceof UniqueConstraintError) {
      const field = Object.keys(err['fields']);
      throw new DuplicatedUserError(`Duplicated field ${field}`, err);
    }
  }

}

export const Enrollment = new EnrollmentAccess();
