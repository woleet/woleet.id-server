import { UniqueConstraintError, UUID, UUIDV4, DATE } from 'sequelize';
import { DuplicatedUserError } from '../../errors';
import { AbstractInstanceAccess } from './abstract';

const OnboardingModel = {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  userId: { type: UUID },
  expiration: { type: DATE }
};

class OnboardingAccess extends AbstractInstanceAccess<InternalOnboardingObject, ApiPostOnboardingObject> {

  constructor() {
    super();
    this.define('onboarding', OnboardingModel, { paranoid: false });
  }

  async getById(id: string): Promise<SequelizeOnboardingObject> {
    return this.model.findOne({ where: { id } });
  }

  handleError(err: any) {
    if (err instanceof UniqueConstraintError) {
      const field = Object.keys(err['fields']);
      throw new DuplicatedUserError(`Duplicated field ${field}`, err);
    }
  }

}

export const Onboarding = new OnboardingAccess();
