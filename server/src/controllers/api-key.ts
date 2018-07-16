import { APIKey } from '../database';

import * as crypto from 'crypto';
import * as Debug from 'debug';
import { NotFoundAPIKeyError } from '../errors';
const debug = Debug('id:ctr');


export async function createAPIKey(apiKey: ApiPostAPIKeyObject): Promise<InternalAPIKeyObject> {
  debug('Create apiKey');
  const value = crypto.randomBytes(32).toString('base64');
  const newApiKey = await APIKey.create(Object.assign(apiKey, { value }));

  return newApiKey.toJSON();
}

export async function updateAPIKey(id: string, attrs: ApiPutAPIKeyObject): Promise<InternalAPIKeyObject> {
  debug('Update apiKey', attrs);
  const updatedApiKey = await APIKey.update(id, attrs);
  return updatedApiKey.toJSON();
}

export async function getAPIKeyById(id: string): Promise<InternalAPIKeyObject> {
  debug('Get apiKey' + id);

  const apiKey = await APIKey.getById(id);

  if (!apiKey)
    throw new NotFoundAPIKeyError();

  debug('Got apiKey');
  return apiKey.toJSON();
}

export async function getAllAPIKeys(): Promise<InternalAPIKeyObject[]> {
  const apiKeys = await APIKey.getAll();
  return apiKeys.map((apiKey) => apiKey.toJSON());
}

export async function deleteAPIKey(id: string): Promise<InternalAPIKeyObject> {

  const apiKey = await APIKey.delete(id);

  if (!apiKey)
    throw new NotFoundAPIKeyError();

  return apiKey.toJSON();
}
