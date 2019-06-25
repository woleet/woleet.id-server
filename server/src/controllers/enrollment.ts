import { Enrollment, Key, User } from '../database';
import { EnrollmentExpiredError, NotFoundEnrollmentError, NotFoundUserError } from '../errors';
import * as crypto from 'crypto';
import { readFileSync } from 'fs';
import * as path from 'path';
import { getServerConfig } from './server-config';
import * as https from 'https';
import { Observable } from 'rxjs';
import { sendEnrollmentFinalizeEmail, sendKeyEnrollmentEmail } from './send-email';
import * as timestring from 'timestring';
import { getAgent } from './utils/agent';
import * as log from 'loglevel';

const TCUPath = path.join(__dirname, '../../assets/custom_TCU.pdf');

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

  // Check expiration
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
  const TCU = readFileSync(TCUPath, { encoding: 'base64' });
  const hash = crypto.createHash('sha256');
  hash.update(Buffer.from(TCU, 'base64'));
  return hash.digest('hex');
}

/**
 * Create a signature request in ProofDesk with the current TCU hash and the enrolled user as the only authorized signee
 * @param enrollmentId the enrollment identifiant
 */
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
        "phone": ${user.phone ? '"' + user.phone + '"' : null},
        "countryCallingCode": ${user.countryCallingCode ? '"' + user.countryCallingCode + '"' : null},
        "device": ${enrollment.device ? '"' + enrollment.device.toUpperCase() + '"' : null}
      }],
      "public": false,
      "name": "${getServerConfig().organizationName} Signature Service TCU.pdf",
      "hashToSign": "${hashTCU}"
    }`;

  return new Promise(async (resolve, reject) => {
    const req = https.request(httpsOptions, (res) => {
      res.on('data', async (data) => {
        const signatureRequest = JSON.parse(data);
        await Enrollment.update(enrollmentId, { signatureRequestId: signatureRequest.id });
        resolve(signatureRequest);
      });
    }).on('error', (err) => {
      reject(err);
    });
    req.write(body);
    req.end();
  });
}

/**
 * Monitor the enrollment request with a pulling request to retrive the address of the enrolled key.
 * @param signatureRequestId the signature request id
 * @param enrollmentId the enrollment id
 * @param user the enrolled user
 */
export async function monitorSignatureRequest(signatureRequestId: string, enrollmentId: string, user: InternalUserObject) {
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

  // Create an observable that get the signature request every 30 secondes.
  const observable = new Observable<any>(subscriber => {
    const interval = setInterval(() => {
      https.get(httpsOptions, (res) => {
        let data = '';
        let signatureRequest;
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', async () => {
          signatureRequest = JSON.parse(data);
          subscriber.next(signatureRequest);
          try {
            await testEnrollmentExpiration(enrollmentId, user);
          } catch (error) {
            subscriber.error(error);
            subscriber.unsubscribe();
          }
          if (signatureRequest.anchors && signatureRequest.anchors.length > 0) {
            // Once the signature request is fulfilled, finalize the enrollment
            await finalizeEnrollment(enrollmentId, user, signatureRequest);
            subscriber.complete();
          }
        });
      }).on('error', (error) => {
        subscriber.error(error);
        subscriber.unsubscribe();
      });
    }, 1000 * 30);
    return () => clearInterval(interval);
  });

  observable
    .subscribe(async (res) => {
        return;
      },
      (error) => {
        log.error(error);
      }
    );
}

async function finalizeEnrollment(enrollmentId: string, user: InternalUserObject, signatureRequest: any) {
  const publicKey = signatureRequest.anchors[0].pubKey;
  const enrollment = await getEnrollmentById(enrollmentId);
  const name = enrollment.name;
  const userId = enrollment.userId;

  // Guess the type of the device used to sign
  // FIXME: the type of the device used to sign the TCU is retrieved first from the signature request,
  //  then from the enrollment, or we fallback on mobile (until the mobile app is updated to register the device type)
  const signeeDevice = signatureRequest.authorizedSignees[0].device ?
    signatureRequest.authorizedSignees[0].device.toLowerCase() : null;
  const device = signeeDevice || enrollment.device || 'mobile';
  const expiration = enrollment.keyExpiration;
  try {

    // Create a new external key: this must be done before setting the identity URL on the signature anchor,
    // so that the public key can be resolved through the identity URL
    await Key.create(Object.assign({
      name,
      publicKey,
      holder: 'user',
      userId,
      device,
      expiration
    }));

    // Set the identity URL on the signature anchor created by the signature request
    if (getServerConfig().identityURL) {
      await setAnchorProperties(signatureRequest, `{ "identityURL": "${getServerConfig().identityURL}" }`);
    }

    // Send a enrollment success email to the admin
    await sendEnrollmentFinalizeEmail(user.x500CommonName, publicKey, true);
  } catch (error) {
    log.error('Failed to finalize enrollment', error.message);

    // Send a enrollment failure email to the admin
    await sendEnrollmentFinalizeEmail(user.x500CommonName, publicKey, false);
  } finally {

    // In all cases, delete the enrollment
    await deleteEnrollment(enrollmentId);
  }
}

/**
 * Set some properties on the signature anchor created by a signature request.
 * @param signatureRequest the signature request
 * @param properties anchor properties provided as a JSON string
 */
async function setAnchorProperties(signatureRequest: any, properties: string) {
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
  const body = properties;
  const req = https.request(httpsOptions);
  req.on('error', (error) => {
    log.error(error);
  });
  req.write(body);
  req.end();
}

/**
 * Test if the enrollment expiration date is reached.
 * If the the enrollment is expired send a mail to the admin, delete the enrollment and the corresponding signature request.
 * @param enrollmentId the enrollment id
 * @param user the enrolled user
 */
async function testEnrollmentExpiration(enrollmentId: string, user: InternalUserObject) {

  // Check enrollment expiration date
  const enrollment = await Enrollment.getById(enrollmentId);
  const expiration = enrollment.get('expiration');
  if (expiration && (Date.now() > expiration)) {

    // Send a enrollment failure email to the admin and delete the enrollment
    sendEnrollmentFinalizeEmail(user.x500CommonName, null, false);
    deleteEnrollment(enrollmentId);

    // Delete the corresponding signature request
    const url = new URL(getServerConfig().proofDeskAPIURL);
    const httpsOptions: any = {
      host: url.host,
      path: url.pathname + `/signatureRequest/${enrollment.get('signatureRequestId')}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getServerConfig().proofDeskAPIToken
      }
    };
    const agent = getAgent(url, `/signatureRequest/${enrollment.get('signatureRequestId')}`);
    if (agent) {
      httpsOptions.agent = agent;
    }
    const req = https.request(httpsOptions);
    req.end();
    throw new EnrollmentExpiredError();
  }
  return;
}
