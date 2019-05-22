import { Onboarding, User, Key } from '../database';
import { NotFoundOnboardingError, OnboardingExpiredError } from '../errors';
import * as crypto from 'crypto';
import { readFileSync } from 'fs';
import * as path from 'path';
import { getServerConfig } from './server-config';
import * as https from 'https';
import log = require('loglevel');
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { sendEnrolmentFinalizeEmail } from './send-email';
import * as timestring from 'timestring';

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
  const expiration = !!getServerConfig().enrolmentExpirationOffset ?
    Date.now() + timestring(getServerConfig().enrolmentExpirationOffset) * 1000 :
    null;
  const newOnboarding = await Onboarding.create(Object.assign({}, {
    userId,
    expiration
  }));
  return newOnboarding.toJSON();
}

export async function getOnboardingById(id: string): Promise<InternalOnboardingObject> {
  const onboarding = await Onboarding.getById(id);

  if (!onboarding) {
    throw new NotFoundOnboardingError();
  }

  if (onboarding.toJSON().expiration) {
    if (Date.now() > onboarding.toJSON().expiration) {
      deleteOnboarding(id);
      throw new OnboardingExpiredError();
    }
  }

  return onboarding.toJSON();
}

export async function getOwner(id): Promise<InternalUserObject> {
  const onboarding = await Onboarding.getById(id);

  if (!onboarding) {
    throw new NotFoundOnboardingError();
  }


  if (onboarding.toJSON().expiration) {
    if (Date.now() > onboarding.toJSON().expiration) {
      deleteOnboarding(id);
      throw new OnboardingExpiredError();
    }
  }

  // get user by onboarding userId
  const user = await User.getById(onboarding.get('userId'));

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

      res.on('data', (result) => {
        resolve(JSON.parse(result.toString()));
      });

    }).on('error', (err) => {
      reject(err);
    });
    req.write(body);
    req.end();
  });
}

export async function monitorSignatureRequests(requestId: string, onboardingId: string, user: ApiUserObject) {
  const url = new URL(getServerConfig().proofDeskAPIURL);
  const httpsOptions = {
    host: url.host,
    path: url.pathname + `/signatureRequest/${requestId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getServerConfig().proofDeskAPIToken
    }
  };
  let result;
  const observable = new Observable<any>(subscriber => {

    const interval = setInterval(() => {
      https.get(httpsOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          result = JSON.parse(data);
          subscriber.next(result);
        });
      }).on('error', (err) => {
        log.error(err);
      });
    }, 1000 * 6);

    return () => clearInterval(interval);
  });
  observable
    .pipe(takeWhile(res => {
      if (res.anchors.length > 0) {
        return !res.anchors[0].pubKey;
      } else {
        return true;
      }
    }))
    .subscribe(() => { return; },
      error => log.error(error),
      () => {
        finalizeOnboarding(onboardingId, user, result.anchors[0].pubKey);
      }
    );
}

async function finalizeOnboarding(onboardingId: string, user: ApiUserObject, publicKey: string) {
  const name = user.identity.commonName + '\'s key';
  const userId = user.id;
  await Key.create(Object.assign({
    name,
    publicKey,
    holder: 'user',
    userId
  }));
  deleteOnboarding(onboardingId);
  sendEnrolmentFinalizeEmail(user.identity.commonName, publicKey);
}
