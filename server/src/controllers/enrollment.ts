import { Enrollment, Key, User } from '../database';
import { NotFoundEnrollmentError, NotFoundUserError, EnrollmentExpiredError } from '../errors';
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
  return enrollment.toJSON();
}

export async function getEnrollmentUser(id): Promise<InternalUserObject> {

  // Get enrollment
  const enrollment = await Enrollment.getById(id);
  if (!enrollment) {
    throw new NotFoundEnrollmentError();
  }

  if (enrollment.get('expiration') && (Date.now() > enrollment.get('expiration'))) {
    throw new EnrollmentExpiredError();
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

export async function createSignatureRequest(enrollmentId): Promise<any> {
  const config = getServerConfig();
  const user = await getEnrollmentUser(enrollmentId);
  const enrollment = await getEnrollmentById(enrollmentId);
  const url = new URL(config.proofDeskAPIURL);
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
        "device": ${enrollment.device ? '"' + enrollment.device.toUpperCase() + '"' : null}
      }],
      "name": "${getServerConfig().organizationName} Signature Service TCU.pdf",
      "hashToSign": "${hashTCU}"
    }`;

  return new Promise(async (resolve, reject) => {
    const req = https.request(httpsOptions, (res) => {
      res.on('data', (data) => {
        resolve(JSON.parse(data));
      });
    }).on('error', (err) => {
      reject(err);
    });
    req.write(body);
    req.end();
  });
}

export function monitorSignatureRequest(signatureRequestId: string, enrollmentId: string, user: InternalUserObject) {
  const url = new URL(getServerConfig().proofDeskAPIURL);
  const httpsOptions: any = {
    host: url.host,
    path: url.pathname + `/signatureRequest/${signatureRequestId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getServerConfig().proofDeskAPIToken
    }
  };
  const agent = getAgent(url, `/signatureRequest/${signatureRequestId}`);
  if (agent) {
    httpsOptions.agent = agent;
  }

  let signatureRequest;
  const observable = new Observable<any>(subscriber => {
    const interval = setInterval(() => {
      https.get(httpsOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          signatureRequest = JSON.parse(data);
          subscriber.next(signatureRequest);
        });
      }).on('error', (error) => {
        log.error(error);
      });
    }, 1000 * 5);
    return () => clearInterval(interval);
  });

  observable
    .pipe(takeWhile(signatureRequest => {
      if (signatureRequest.anchors && signatureRequest.anchors.length > 0) {
        return !signatureRequest.anchors[0].pubKey;
      } else {
        return true;
      }
    }))
    .subscribe(() => {
        return;
      },
      error => log.error(error),
      async () => {

        // Once the signature request is fulfilled, finalize the enrollment
        await finalizeEnrollment(enrollmentId, user, signatureRequest);
      }
    );
}

async function finalizeEnrollment(enrollmentId: string, user: InternalUserObject, signatureRequest: any) {
  const publicKey = signatureRequest.anchors[0].pubKey;
  const enrollment = await getEnrollmentById(enrollmentId);
  const name = enrollment.name;
  const userId = enrollment.userId;
  // FIXME: the type of the device used to sign the TCU is retrieved first from the signature request,
  // then from the enrollment, or we fallback on mobile (until the mobile app is updated to register the device type)
  const signeeDevice = signatureRequest.authorizedSignees[0].device ?
    signatureRequest.authorizedSignees[0].device.toLowerCase() : null;
  const device = signeeDevice || enrollment.device || 'mobile';
  try {

    // Create new external key: this must be done before setting the identity URL on the signature anchor,
    // so that the public key can be resolved through the identity URL
    await Key.create(Object.assign({
      name,
      publicKey,
      holder: 'user',
      userId,
      device
    }));

    // Set the identity URL on the signature anchor created by the signature request
    await setAnchorIdentityURL(signatureRequest);

    // Send a enrollment success email to the admin
    await sendEnrollmentFinalizeEmail(user.x500CommonName, publicKey, true);
  } catch (error) {
    log.error('Failed to finalize enrollment', error);

    // Send a enrollment failure email to the admin
    await sendEnrollmentFinalizeEmail(user.x500CommonName, publicKey, false);
  } finally {

    // In all cases, delete the enrollment
    await deleteEnrollment(enrollmentId);
  }
}

async function setAnchorIdentityURL(signatureRequest: any) {
  if (!getServerConfig().identityURL)
    return;
  const url = new URL(getServerConfig().proofDeskAPIURL);
  const httpsOptions: any = {
    host: url.host,
    path: url.pathname + `/anchor/${signatureRequest.anchors[0].id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getServerConfig().proofDeskAPIToken
    }
  };
  const agent = getAgent(url, `/anchor/${signatureRequest.anchors[0].id}`);
  if (agent) {
    httpsOptions.agent = agent;
  }
  const body = `{
         "identityURL": "${getServerConfig().identityURL}"
         }`;
  const req = https.request(httpsOptions);
  req.on('error', (error) => {
    log.error(error);
  });
  req.write(body);
  req.end();
}
