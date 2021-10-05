import { APIToken, User } from '../database';

import * as crypto from 'crypto';
import * as Debug from 'debug';
import { APITokenOwnerMismatchError, ForbiddenAPITokenError, NotFoundAPITokenError } from '../errors';
import { store } from './store.api-token';
import { secureModule } from '../config';
import { getUserById } from './user';
import { FindOptions, Op, Sequelize } from 'sequelize';

const debug = Debug('id:ctr');

export async function createAPIToken(apiToken: ApiPostAPITokenObject): Promise<InternalAPITokenObject> {
  debug('Create apiToken');
  const random = crypto.randomBytes(32);
  const { data, iv } = await secureModule.encrypt(random);
  const hash = crypto.createHash('sha256').update(random).digest('hex');
  const value = data.toString('hex');
  const valueIV = iv.toString('hex');

  const newApiToken = await APIToken.create(Object.assign(apiToken, { hash, value, valueIV }));

  return newApiToken.get();
}

export async function updateAPIToken(id: string, attrs: ApiPutAPITokenObject,
  userId: string, userRole: UserRoleEnum): Promise<InternalAPITokenObject> {
  debug('Update apiToken', attrs);

  let apiToken = await APIToken.getById(id);
  const apiTokenUserId = apiToken.getDataValue('userId');
  if (!apiToken) {
    throw new NotFoundAPITokenError();
  }
  if (userRole && userRole === 'user' && userId && apiTokenUserId !== userId) {
    throw new APITokenOwnerMismatchError();
  }
  if (userRole && userRole === 'manager') {
    if (!apiTokenUserId) {
      throw new ForbiddenAPITokenError();
    }
    const user = await getUserById(apiTokenUserId);
    if (user.role === 'admin') {
      throw new ForbiddenAPITokenError();
    }
  }
  apiToken = await APIToken.update(id, attrs);

  store.resetCache(apiToken.getDataValue('hash'));
  return apiToken.get();
}

export async function getAPITokenById(id: string): Promise<InternalAPITokenObject> {
  debug('Get apiToken', id);

  const apiToken = await APIToken.getById(id);

  if (!apiToken) {
    throw new NotFoundAPITokenError();
  }

  debug('Got apiToken');
  return apiToken.get();
}

export async function getAllAPITokens(userRole: string): Promise<InternalAPITokenObject[]> {
  let apiTokens;
  if (userRole === 'manager') {
    const opts: FindOptions = {
      include: [{
        model: User.model,
        where: {
          role: {
            [Op.ne]: 'admin'
          }
        }
      }]

    };
    apiTokens = await APIToken.getAll(opts);
  } else {
    apiTokens = await APIToken.getAll();
  }
  return apiTokens.map((apiToken) => apiToken.get());
}

export async function getAPITokensByUser(userId: string): Promise<InternalAPITokenObject[]> {
  const apiTokens = await APIToken.getByUserId(userId);
  return apiTokens.map((apiToken) => apiToken.get());
}

export async function deleteAPIToken(
  id: string, userId: string, userRole: UserRoleEnum
): Promise<InternalAPITokenObject> {

  const apiToken = await APIToken.getById(id);
  const apiTokenUserId = apiToken.getDataValue('userId');
  if (!apiToken) {
    throw new NotFoundAPITokenError();
  }
  if (userRole && userRole === 'user' && userId && apiTokenUserId !== userId) {
    throw new APITokenOwnerMismatchError();
  }
  if (userRole && userRole === 'manager') {
    if (!apiToken.get('userId')) {
      throw new ForbiddenAPITokenError();
    }
    const user = await getUserById(apiTokenUserId);
    if (user.role === 'admin') {
      throw new ForbiddenAPITokenError();
    }
  }

  await APIToken.delete(id);

  store.resetCache(apiToken.getDataValue('value'));

  return apiToken.get();
}
