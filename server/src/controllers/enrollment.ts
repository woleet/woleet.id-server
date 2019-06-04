import { Enrollment, Key, User } from '../database';
import { EnrollmentExpiredError, NotFoundEnrollmentError } from '../errors';
import * as crypto from 'crypto';
import { readFileSync } from 'fs';
import * as path from 'path';
import { getServerConfig } from './server-config';
import * as https from 'https';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { sendEnrollmentFinalizeEmail } from './send-email';
import * as timestring from 'timestring';
import log = require('loglevel');
import { getAgent } from './utils/agent';

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
export async function createEnrollment(userId: string): Promise<InternalEnrollmentObject> {
  const expiration = !!getServerConfig().enrollmentExpirationOffset ?
    Date.now() + timestring(getServerConfig().enrollmentExpirationOffset) * 1000 :
    null;
  const newEnrollment = await Enrollment.create(Object.assign({}, {
    userId,
    expiration
  }));
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

  // get user by enrollment userId
  const user = await User.getById(enrollment.get('userId'));

  return user.toJSON();
}

export async function getAllEnrollment(full = false): Promise<InternalEnrollmentObject[]> {
  const enrollments = await Enrollment.getAll({ full });
  return enrollments.map((enrollment) => enrollment.toJSON());
}

export async function deleteEnrollment(id: string): Promise<InternalEnrollmentObject> {

  const enrollment = await Enrollment.delete(id);

  if (!enrollment) {
    throw new NotFoundEnrollmentError();
  }

  return enrollment.toJSON();
}

export async function getTCUHash(): Promise<string> {

  const TCU = readFileSync(path.join(__dirname, '../../assets/custom_TCU.pdf'), { encoding: 'base64' });

  const hash = crypto.createHash('sha256');
  hash.update(Buffer.from(TCU, 'base64'));

  return hash.digest('hex');
}

export async function createSignatureRequest(hash: string, email: string) {
  const user = await User.getByEmail(email);
  const userJSON = user.toJSON();
  const url = new URL(getServerConfig().proofDeskAPIURL);
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
    .subscribe(() => { return; },
      error => log.error(error),
      async () => {
        await finalizeEnrollment(enrollmentId, user, result.anchors[0].pubKey);
        if (getServerConfig().identityURL) {

          const httpsOptionsPut: any = {
            host: url.host,
            path: url.pathname + `/anchor/${result.anchors[0].id}`,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + getServerConfig().proofDeskAPIToken
            }
          };
          const agentPut = getAgent(url, `/anchor/${result.anchors[0].id}`);
          if (agentPut) {
            httpsOptionsPut.agent = agentPut;
          }
          const body = `{
          "identityURL": "${getServerConfig().identityURL}"
          }`;
          const req = https.request(httpsOptionsPut, (res) => {
            log.info('STATUS: ' + res.statusCode);
            log.info('HEADERS: ' + JSON.stringify(res.headers));
            res.on('data', function (chunk) {
              log.info('BODY: ' + chunk);
            });
          });
          req.on('error', function (e) {
            log.error(e.message);
          });
          req.write(body);
          req.end();
        }
      }
    );
}

async function finalizeEnrollment(enrollmentId: string, user: ApiUserObject, publicKey: string) {
  const name = user.identity.commonName + '\'s key';
  const userId = user.id;
  try {
    await Key.create(Object.assign({
      name,
      publicKey,
      holder: 'user',
      userId
    }));
    sendEnrollmentFinalizeEmail(user.identity.commonName, publicKey, true);
  } catch (err) {
    sendEnrollmentFinalizeEmail(user.identity.commonName, publicKey, false);
    log.error(err.errors);
  }
  deleteEnrollment(enrollmentId);
}
