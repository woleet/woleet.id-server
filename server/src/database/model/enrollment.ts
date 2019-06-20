import { DATE, ENUM, ForeignKeyConstraintError, STRING, UUID, UUIDV4 } from 'sequelize';
import { InvalidForeignUserError } from '../../errors';
import { AbstractInstanceAccess } from './abstract';

const EnrollmentModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  userId: { type: UUID },
  expiration: { type: DATE },
  name: { type: STRING, allowNull: false },
  device: { type: ENUM(['server', 'nano', 'mobile']), allowNull: true },
  signatureRequestId: {type: STRING, allowNull: true }
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
    if (err instanceof ForeignKeyConstraintError) {
      throw new InvalidForeignUserError();
    }
  }
}

export const Enrollment = new EnrollmentAccess();
