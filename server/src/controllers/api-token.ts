import { APIToken } from '../database';

import * as crypto from 'crypto';
import * as Debug from 'debug';
import { NotFoundAPITokenError } from '../errors';
import { store } from './store.api-token';

const debug = Debug('id:ctr');

export async function createAPIToken(apiToken: ApiPostAPITokenObject): Promise<InternalAPITokenObject> {
  debug('Create apiToken');
  const value = crypto.randomBytes(32).toString('base64');
  const newApiToken = await APIToken.create(Object.assign(apiToken, { value }));

  return newApiToken.toJSON();
}

export async function updateAPIToken(id: string, attrs: ApiPutAPITokenObject): Promise<InternalAPITokenObject> {
  debug('Update apiToken', attrs);
  const updatedApiToken = await APIToken.update(id, attrs);
  store.resetCache(updatedApiToken.getDataValue('value'));
  return updatedApiToken.toJSON();
}

export async function getAPITokenById(id: string): Promise<InternalAPITokenObject> {
  debug('Get apiToken' + id);

  const apiToken = await APIToken.getById(id);

  if (!apiToken) {
    throw new NotFoundAPITokenError();
  }

  debug('Got apiToken');
  return apiToken.toJSON();
}

export async function getAllAPITokens(full = false): Promise<InternalAPITokenObject[]> {
  const apiTokens = await APIToken.getAll({ full });
  return apiTokens.map((apiToken) => apiToken.toJSON());
}

export async function deleteAPIToken(id: string): Promise<InternalAPITokenObject> {
  const apiToken = await APIToken.delete(id);

  store.resetCache(apiToken.getDataValue('value'));

  if (!apiToken) {
    throw new NotFoundAPITokenError();
  }

  return apiToken.toJSON();
}
