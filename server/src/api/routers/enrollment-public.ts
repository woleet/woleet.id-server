import * as Router from 'koa-router';
import { store as event } from '../../controllers/server-event';
import { serializeUser } from '../serialize/user';
import {
  createSignatureRequest, getOwner, monitorSignatureRequest
} from '../../controllers/enrollment';

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
  const { id } = ctx.params;
  ctx.body = serializeUser(await getOwner(id));
});

/**
 * @route: /enrollment/:id/create-signature-request
 * @swagger
 *  operationId: createSignatureRequest
 */
router.post('/enrollment/:id/create-signature-request', async function (ctx) {

  // Get the user targeted by the enrollment
  const { id: enrollmentId } = ctx.params;
  const user = await getOwner(enrollmentId);

  // Create a signature request of the TCU and send it to this user
  const { id: signatureRequestId } = await createSignatureRequest(enrollmentId);

  // Start monitoring this signature request
  monitorSignatureRequest(signatureRequestId, enrollmentId, user);

  // Register signature request creation event
  event.register({
    type: 'enrollment.create-signature-request',
    authorizedUserId: null,
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: signatureRequestId
  });

  // Return the identifier of the signature request
  ctx.body = JSON.stringify(signatureRequestId);
});

export { router };
