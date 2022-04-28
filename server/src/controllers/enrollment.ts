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
import { cacheLock } from '../cacheLock';
import { BadRequest } from 'http-errors';
import { getUserById } from './user';
import { InternalEnrollmentObject, InternalUserObject } from '../types';

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

  // Verify that the expiration date is not a seal user
  if (user.get('mode') === 'seal') {
    throw new BadRequest('Cannot enroll a seal user');
  }

  const expiration = !!getServerConfig().enrollmentExpirationOffset ?
    Date.now() + timestring(getServerConfig().enrollmentExpirationOffset) * 1000 :
    null;
  enrollment.expiration = enrollment.expiration || expiration;
  const newEnrollment = await Enrollment.create(enrollment);
  if (!enrollment.test) {
    await sendKeyEnrollmentEmail(user.get(), newEnrollment.get().id);
  }
  return newEnrollment.get();
}

export async function getEnrollmentById(id: string): Promise<InternalEnrollmentObject> {
  try {
    const enrollment = await Enrollment.getById(id);
    if (!enrollment) {
      throw new NotFoundEnrollmentError();
    }
    return enrollment.get();
  } catch (err) {
    throw err;
  }
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
  const user = await User.getById(enrollment.getDataValue('userId'));
  return user.get();
}

export async function getAllEnrollment(): Promise<InternalEnrollmentObject[]> {
  const enrollments = await Enrollment.getAll();
  return enrollments.map((enrollment) => enrollment.get());
}

export async function deleteEnrollment(id: string): Promise<InternalEnrollmentObject> {
  const enrollment = await Enrollment.delete(id);
  if (!enrollment) {
    throw new NotFoundEnrollmentError();
  }
  return enrollment.get();
}

export async function putEnrollment(id: string, enrollment: ApiPutEnrollmentObject): Promise<InternalEnrollmentObject> {
  const enrollmentUp = await Enrollment.update(id, enrollment);
  if (!enrollmentUp) {
    throw new NotFoundEnrollmentError();
  }
  return enrollmentUp.get();
}

export async function getTCUHash(): Promise<string> {
  const TCU = readFileSync(TCUPath, { encoding: 'base64' });
  const hash = crypto.createHash('sha256');
  hash.update(Buffer.from(TCU, 'base64'));
  return hash.digest('hex');
}

/**
 * Create a signature request in ProofDesk with the current TCU hash and the enrolled user as the only authorized signee
 * @param enrollmentId the enrollment identifier
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
  const body = {
    authorizedSignees: [
      {
        commonName: user.x500CommonName,
        email: user.email,
        phone: user.phone,
        countryCallingCode: user.countryCallingCode,
        device: enrollment.device ? enrollment.device.toUpperCase() : null
      }],
    public: false,
    name: getServerConfig().organizationName + 'Signature Service TCU.pdf',
    hashToSign: hashTCU
  };
  return new Promise(async (resolve, reject) => {
    const req = https.request(httpsOptions, (res) => {
      let data;
      res.on('data', async (chunk) => {
        data = JSON.parse(chunk);
      });

      res.on('end', async () => {
        switch (res.statusCode) {
          case 200:
            await Enrollment.update(enrollmentId, { signatureRequestId: data.id });
            resolve(data);
            break;
          default:
            reject({ code: res.statusCode, data });
            break;
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
    req.write(JSON.stringify(body));
    req.end();
  });
}

/**
 * Monitor an enrollment by pulling the signature request to retrieve the address of the enrolled key.
 * @param signatureRequestId the signature request id
 * @param enrollmentId the enrollment id
 * @param user the enrolled user
 */
export async function monitorSignatureRequest(signatureRequestId: string, enrollmentId: string) {

  // Prepare an HTTP request to get the signature request
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

  // Create an observable that get the signature request every 60 seconds
  const observable = new Observable<any>(subscriber => {
    const interval = setInterval(() => {
      const req = https.get(httpsOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', async () => {
          switch (res.statusCode) {
            case 200:
              subscriber.next(JSON.parse(data));
              break;
            default:
              log.error('Cannot get signature request', { code: res.statusCode, data });
              break;
          }
        });
      });
      req.on('error', (error) => {
        log.error('Cannot get signature request', error);
      });
    }, 1000 * 60);
    return () => clearInterval(interval);
  });

  const signatureRequestSubscriber = observable.subscribe(
    async (signatureRequest) => {
      cacheLock.doLockByCache('monitorSignatureRequest', async () => {

        // Expire the enrollment if required
        try {
          await testEnrollmentExpiration(enrollmentId);
        } catch (error) {
          log.error(error);
          signatureRequestSubscriber.unsubscribe();
        }

        // Once the signature request is fulfilled, finalize the enrollment
        if (signatureRequest.anchors && signatureRequest.anchors.length > 0) {
          await finalizeEnrollment(enrollmentId, signatureRequest);
          signatureRequestSubscriber.unsubscribe();
        }
      }, 0);
    },
    (error) => {
      log.error(error);
    }
  );
}

async function finalizeEnrollment(enrollmentId: string, signatureRequest: any) {
  const publicKey = signatureRequest ? signatureRequest.anchors[0].pubKey : null;
  const enrollment = await getEnrollmentById(enrollmentId);
  const name = enrollment.name;
  const userId = enrollment.userId;
  const user = await getUserById(enrollment.userId);

  // Create a new external key: this must be done before setting the identity URL on the signature anchor,
  // so that the public key can be resolved through the identity URL
  try {

    // Guess the type of the device used to sign
    // FIXME: the type of the device used to sign the TCU is retrieved first from the signature request,
    //  then from the enrollment, or we fallback on mobile (until the mobile app is updated to register the device type)
    const signeeDevice = signatureRequest.authorizedSignees[0].device ?
      signatureRequest.authorizedSignees[0].device.toLowerCase() : null;
    const device = signeeDevice || enrollment.device || 'mobile';
    const expiration = enrollment.keyExpiration;
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
    await sendEnrollmentFinalizeEmail(user.x500CommonName, publicKey, true, null);
  } catch (error) {
    log.error('Cannot finalize enrollment', error.original.detail);

    // Send a enrollment failure email to the admin
    await sendEnrollmentFinalizeEmail(user.x500CommonName, publicKey, false, error.errors[0].message);
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
  const req = https.request(httpsOptions, (res) => {
    let data;
    res.on('data', async (chunk) => {
      data = JSON.parse(chunk);
    });

    res.on('end', async () => {
      switch (res.statusCode) {
        case 200:
          log.debug(data);
          break;
        default:
          log.error({ code: res.statusCode, data });
          break;
      }
    });
  });
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
async function testEnrollmentExpiration(enrollmentId: string) {

  // Check enrollment expiration date
  const enrollment = await Enrollment.getById(enrollmentId);
  const expiration = enrollment.getDataValue('expiration');
  if (expiration && (Date.now() > expiration)) {

    const user = await getUserById(enrollment.getDataValue('userId'));

    // Send a enrollment failure email to the admin and delete the enrollment
    sendEnrollmentFinalizeEmail(user.x500CommonName, null, false, 'The enrollment expiration date is reached');
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
    const req = https.request(httpsOptions, (res) => {
      let data;
      res.on('data', async (chunk) => {
        data = JSON.parse(chunk);
      });
      res.on('end', async () => {
        switch (res.statusCode) {
          case 200:
            log.debug(data);
            break;
          default:
            log.error({ code: res.statusCode, data });
            break;
        }
      });
    });
    req.end();
    throw new EnrollmentExpiredError();
  }
}
