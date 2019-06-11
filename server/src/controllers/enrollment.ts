import { Enrollment, Key, User } from '../database';
import { EnrollmentExpiredError, NotFoundEnrollmentError, NotFoundUserError } from '../errors';
import * as crypto from 'crypto';
import { readFileSync } from 'fs';
import * as path from 'path';
import { getServerConfig } from './server-config';
import * as https from 'https';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { sendEnrollmentFinalizeEmail, sendKeyEnrollmentEmail } from './send-email';
import * as timestring from 'timestring';
import { getAgent } from './utils/agent';
import log = require('loglevel');

/**
 * Enrollment
 * Request handlers for enrollment.
 * @alias module:handlers.Enrollment
 * @swagger
 *  tags: [authentication]
 */

/**
 * @swagger
 *  operationId: createEnrollment
 */
export async function createEnrollment(enrollment: ApiPostEnrollmentObject): Promise<InternalEnrollmentObject> {
  const user = await User.getById(enrollment.userId);
  if (!user) {
    throw new NotFoundUserError();
  }
  const expiration = !!getServerConfig().enrollmentExpirationOffset ?
    Date.now() + timestring(getServerConfig().enrollmentExpirationOffset) * 1000 :
    null;
  enrollment.expiration = enrollment.expiration || expiration;
  const newEnrollment = await Enrollment.create(enrollment);
  if (!enrollment.test) {
    await sendKeyEnrollmentEmail(user.toJSON(), newEnrollment.toJSON().id);
  }
  return newEnrollment.toJSON();
}

export async function getEnrollmentById(id: string): Promise<InternalEnrollmentObject> {
  const enrollment = await Enrollment.getById(id);

  if (!enrollment) {
    throw new NotFoundEnrollmentError();
  }

  if (enrollment.toJSON().expiration) {
    if (Date.now() > enrollment.toJSON().expiration) {
      deleteEnrollment(id);
      throw new EnrollmentExpiredError();
    }
  }

  return enrollment.toJSON();
}

export async function getOwner(id): Promise<InternalUserObject> {

  // Get enrollment
  const enrollment = await Enrollment.getById(id);
  if (!enrollment) {
    throw new NotFoundEnrollmentError();
  }

  // Check that enrollment is not expired
  if (enrollment.toJSON().expiration) {
    if (Date.now() > enrollment.toJSON().expiration) {
      deleteEnrollment(id);
      throw new EnrollmentExpiredError();
    }
  }

  // Return enrolled user
  const user = await User.getById(enrollment.get('userId'));
  return user.toJSON();
}

export async function getAllEnrollment(): Promise<InternalEnrollmentObject[]> {
  const enrollments = await Enrollment.getAll();
  return enrollments.map((enrollment) => enrollment.toJSON());
}

export async function deleteEnrollment(id: string): Promise<InternalEnrollmentObject> {

  const enrollment = await Enrollment.delete(id);

  if (!enrollment) {
    throw new NotFoundEnrollmentError();
  }

  return enrollment.toJSON();
}

export async function putEnrollment(id: string, enrollment: ApiPutEnrollmentObject): Promise<InternalEnrollmentObject> {

  const enrollmentUp = await Enrollment.update(id, enrollment);

  if (!enrollmentUp) {
    throw new NotFoundEnrollmentError();
  }

  return enrollmentUp.toJSON();
}

export async function getTCUHash(): Promise<string> {

  const TCU = readFileSync(path.join(__dirname, '../../assets/custom_TCU.pdf'), { encoding: 'base64' });

  const hash = crypto.createHash('sha256');
  hash.update(Buffer.from(TCU, 'base64'));

  return hash.digest('hex');
}

export async function startKeyRegistration(enrollmentId) {
  const config = getServerConfig();
  const user = await getOwner(enrollmentId);
  const currentEnrollment = await getEnrollmentById(enrollmentId);
  const url = new URL(config.proofDeskAPIURL);
  const identityURL = config.identityURL;
  const hashTCU = await getTCUHash();
  const httpsOptions: any = {
    host: url.host,
    path: url.pathname + '/signatureRequest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getServerConfig().proofDeskAPIToken
    }
  };
  const agent = getAgent(url, '/signatureRequest');
  if (agent) {
    httpsOptions.agent = agent;
  }
  const body = `{
    "authorizedSignees": [
      {
        "commonName": "${user.x500CommonName}",
        "email": "${user.email}",
        "identityURL": "${identityURL}",
        "device": "${currentEnrollment.device}"
      }],
      "name": "${getServerConfig().organizationName} Signature Service TCU.pdf",
      "hashToSign": "${hashTCU}"
    }`;
  return createSignatureRequest(body, httpsOptions, url);
}

async function createSignatureRequest(body: string, httpsOptions: Object, url: URL) {
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

export async function monitorSignatureRequests(requestId: string, enrollmentId: string, user: ApiUserObject) {
  const url = new URL(getServerConfig().proofDeskAPIURL);
  const httpsOptionsGet: any = {
    host: url.host,
    path: url.pathname + `/signatureRequest/${requestId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getServerConfig().proofDeskAPIToken
    }
  };
  const agentGet = getAgent(url, `/signatureRequest/${requestId}`);
  if (agentGet) {
    httpsOptionsGet.agent = agentGet;
  }
  let result;
  const observable = new Observable<any>(subscriber => {

    const interval = setInterval(() => {
      https.get(httpsOptionsGet, (res) => {
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
    .subscribe(() => {
      return;
    },
      error => log.error(error),
      async () => {
        await finalizeEnrollment(enrollmentId, user, result.anchors[0].pubKey);
      }
    );
}

async function finalizeEnrollment(enrollmentId: string, user: ApiUserObject, publicKey: string) {
  const currentEnrollment = await getEnrollmentById(enrollmentId);
  const name = currentEnrollment.name;
  const userId = user.id;
  const device = currentEnrollment.device;
  try {
    await Key.create(Object.assign({
      name,
      publicKey,
      holder: 'user',
      userId,
      device
    }));
    sendEnrollmentFinalizeEmail(user.identity.commonName, publicKey, true);
  } catch (err) {
    sendEnrollmentFinalizeEmail(user.identity.commonName, publicKey, false);
    log.error(err.errors);
  }
  deleteEnrollment(enrollmentId);
}
