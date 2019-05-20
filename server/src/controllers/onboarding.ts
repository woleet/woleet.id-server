import { Onboarding, User } from '../database';
import { NotFoundOnboardingError } from '../errors';
import * as crypto from 'crypto';
import { readFileSync } from 'fs';
import * as path from 'path';
import { getServerConfig } from './server-config';
import * as https from 'https';
import * as querystring from 'querystring';
import log = require('loglevel');

/**
 * Onboarding
 * Request handlers for onboarding.
 * @alias module:handlers.Onboarding
 * @swagger
 *  tags: [authentication]
 */

/**
 * @swagger
 *  operationId: createOnboarding
 */
export async function createOnboarding(userId: string): Promise<InternalOnboardingObject> {
  const newOnboarding = await Onboarding.create(Object.assign({}, {
    userId
  }));

  return newOnboarding.toJSON();
}

export async function getOnboardingById(id: string): Promise<InternalOnboardingObject> {
  const onboarding = await Onboarding.getById(id);

  if (!onboarding) {
    throw new NotFoundOnboardingError();
  }

  return onboarding.toJSON();
}

export async function getOwner(id): Promise<InternalUserObject> {
  const onboarding = await Onboarding.getById(id);
  // get user by onboarding userId
  const user = await User.getById(onboarding.get('userId'));

  if (!onboarding) {
    throw new NotFoundOnboardingError();
  }

  return user.toJSON();
}

export async function getAllOnboarding(full = false): Promise<InternalOnboardingObject[]> {
  const onboardings = await Onboarding.getAll({ full });
  return onboardings.map((onboarding) => onboarding.toJSON());
}

export async function deleteOnboarding(id: string): Promise<InternalOnboardingObject> {

  const onboarding = await Onboarding.delete(id);

  if (!onboarding) {
    throw new NotFoundOnboardingError();
  }

  return onboarding.toJSON();
}

export async function getTCUHash(): Promise<string> {

  const TCU = readFileSync(path.join(__dirname, '../../assets/default_TCU.pdf'), { encoding: 'base64' });

  const hash = crypto.createHash('sha256');
  hash.update(Buffer.from(TCU, 'base64'));

  return hash.digest('hex');
}

export async function createSignatureRequest(hash: string, email: string) {
  const user = await User.getByEmail(email);
  const userJSON = user.toJSON();
  const url = new URL(getServerConfig().proofDeskAPIURL);
  const httpsOptions = {
    host: url.host,
    path: url.pathname + '/signatureRequest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getServerConfig().proofDeskAPIToken
    }
  };
  const body = `{
    "authorizedSignees": [
      {
        "commonName": "${userJSON.x500CommonName}",
        "email": "${email}"
      }],
      "name": "WIDS TCU signature",
      "hashToSign": "${hash}"
    }`;
  return new Promise(async (resolve, reject) => {
    const req = https.request(httpsOptions, (res) => {

      res.on('data', (response) => {
        resolve(response.toString());
      });

    }).on('error', (err) => {
      reject(err);
    });
    req.write(body);
    req.end();
  });
}
