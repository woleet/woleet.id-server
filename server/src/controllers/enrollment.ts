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
import * as log from 'loglevel';

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

export async function createSignatureRequest(enrollmentId) {
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
        "device": "${currentEnrollment.device ? currentEnrollment.device.toUpperCase() : null}"
      }],
      "name": "${getServerConfig().organizationName} Signature Service TCU.pdf",
      "hashToSign": "${hashTCU}"
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

export function monitorSignatureRequest(requestId: string, enrollmentId: string, user: InternalUserObject) {
  const url = new URL(getServerConfig().proofDeskAPIURL);
  const httpsOptions: any = {
    host: url.host,
    path: url.pathname + `/signatureRequest/${requestId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getServerConfig().proofDeskAPIToken
    }
  };
  const agent = getAgent(url, `/signatureRequest/${requestId}`);
  if (agent) {
    httpsOptions.agent = agent;
  }

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
      }).on('error', (error) => {
        log.error(error);
      });
    }, 1000 * 5);
    return () => clearInterval(interval);
  });

  observable
    .pipe(takeWhile(res => {
      if (res.anchors && res.anchors.length > 0) {
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

async function finalizeEnrollment(enrollmentId: string, user: InternalUserObject, publicKey: string) {
  const currentEnrollment = await getEnrollmentById(enrollmentId);
  const name = currentEnrollment.name;
  const userId = currentEnrollment.userId;
  const device = currentEnrollment.device;
  try {
    await Key.create(Object.assign({
      name,
      publicKey,
      holder: 'user',
      userId,
      device
    }));
    sendEnrollmentFinalizeEmail(user.x500CommonName, publicKey, true);
  } catch (error) {
    sendEnrollmentFinalizeEmail(user.x500CommonName, publicKey, false);
    log.error(error);
  }
  deleteEnrollment(enrollmentId);
}
