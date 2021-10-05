import { APIToken } from '../database';

import * as crypto from 'crypto';
import * as Debug from 'debug';
import { APITokenOwnerMismatchError, NotFoundAPITokenError } from '../errors';
import { store } from './store.api-token';
import { secureModule } from '../config';

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
  if (!apiToken) {
    throw new NotFoundAPITokenError();
  }
  if (userRole && userRole === 'user' && userId && apiToken.get('userId') !== userId) {
    throw new APITokenOwnerMismatchError();
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

export async function getAllAPITokens(): Promise<InternalAPITokenObject[]> {
  const apiTokens = await APIToken.getAll();
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
  if (!apiToken) {
    throw new NotFoundAPITokenError();
  }
  if (userRole && userRole === 'user' && userId && apiToken.get('userId') !== userId) {
    throw new APITokenOwnerMismatchError();
  }

  await APIToken.delete(id);

  store.resetCache(apiToken.getDataValue('value'));

  return apiToken.get();
}
