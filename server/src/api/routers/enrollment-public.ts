import * as Router from 'koa-router';
import { store as event } from '../../controllers/server-event';
import { serializeUser } from '../serialize/user';
import { createSignatureRequest, getEnrollmentUser, monitorSignatureRequest } from '../../controllers/enrollment';
import { BadRequest } from 'http-errors';

/**
 * Key enrollment public
 * Request handlers for key enrollment with public access.
 * @swagger
 *  tags: [enrollment]
 */
const router = new Router();

/**
 * @route: /enrollment/{id}/user
 * @swagger
 *  operationId: getEnrollmentUser
 */
router.get('/enrollment/:id/user', async function (ctx) {

  // Return the user targeted by the enrollment
  const { id: enrollmentId } = ctx.params;
  ctx.body = serializeUser(await getEnrollmentUser(enrollmentId));
});

/**
 * @route: /enrollment/:id/create-signature-request
 * @swagger
 *  operationId: createSignatureRequest
 */
router.post('/enrollment/:id/create-signature-request', async function (ctx) {

  // Get the user targeted by the enrollment
  const { id: enrollmentId } = ctx.params;
  const user = await getEnrollmentUser(enrollmentId);

  // Create a signature request of the TCU and send it to this user
  let signatureRequestId;
  try {
    const { id: signatureReqId } = await createSignatureRequest(enrollmentId);
    signatureRequestId = signatureReqId;

    // Start monitoring this signature request
    monitorSignatureRequest(signatureRequestId, enrollmentId, user);
  } catch (err) {
    throw new BadRequest('SignatureRequestCreationError');
  }

  // Register signature request creation event
  event.register({
    type: 'enrollment.create-signature-request',
    authorizedUserId: null,
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: signatureRequestId
  });

  // Return an empty body
  ctx.body = null;
});

export { router };
