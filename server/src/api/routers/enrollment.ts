import * as Router from 'koa-router';
import { store as event } from '../../controllers/server-event';
import { serializeUser } from '../serialize/user';
import {
  createEnrollment, createSignatureRequest, deleteEnrollment, getAllEnrollment, getEnrollmentById, getOwner,
  monitorSignatureRequest, putEnrollment
} from '../../controllers/enrollment';
import { validate } from "../schemas";
import { getServerConfig } from "../../controllers/server-config";
import { MethodNotAllowed } from "http-errors";

/**
 * Key enrollment
 * Request handlers for key enrollment.
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


/**
 * @route: /enrollment
 * @swagger
 *  operationId: createEnrollment
 */
router.post('/enrollment', validate.body('createEnrollment'), async function (ctx) {

  // Get enrollment to create from body
  const enrollment: ApiPostEnrollmentObject = ctx.request.body;

  // Verify all settings required for enrollment
  // TODO: change this method with an end point to send the mail
  if (!enrollment.test) {
    if (!getServerConfig().enableSMTP) {
      throw new MethodNotAllowed('SMTP Server not configured.');
    }
    if (!getServerConfig().contact) {
      throw new MethodNotAllowed('Admin contact not configured.');
    }
    if (!getServerConfig().webClientURL) {
      throw new MethodNotAllowed('Web client URL not configured.');
    }
    if (!getServerConfig().enableProofDesk) {
      throw new MethodNotAllowed('ProofDesk account not configured.');
    }
  }

  // Create enrollment
  const created = await createEnrollment(enrollment);

  // Register enrollment creation event
  event.register({
    type: 'enrollment.create',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: created.userId,
    associatedKeyId: null,
    data: created.id
  });

  // Return created enrollment in body
  ctx.body = created;
});

/**
 * @route: /enrollment
 * @swagger
 *  operationId: updateEnrollment
 */
router.put('/enrollment/:id', async function (ctx) {
  const enrollment: ApiPutEnrollmentObject = ctx.request.body;
  const { id } = ctx.params;
  const updated = await putEnrollment(id, enrollment);

  event.register({
    type: 'enrollment.edit',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: updated.userId,
    associatedKeyId: null,
    data: id
  });

  ctx.body = updated;
});

/**
 * @route: /enrollment/list
 * @swagger
 *  operationId: getAllEnrollment
 */
router.get('/enrollment/list', async function (ctx) {
  const enrollments = await getAllEnrollment();
  ctx.body = enrollments;
});

router.delete('/enrollment/:id', async function (ctx) {
  const { id } = ctx.params;
  const deleted = await deleteEnrollment(id);

  event.register({
    type: 'enrollment.delete',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: deleted.userId,
    associatedKeyId: null,
    data: id
  });

  ctx.body = deleted;
});

/**
 * @route: /enrollment/{id}
 * @swagger
 *  operationId: getEnrollment
 */
router.get('/enrollment/:id', async function (ctx) {
  const { id } = ctx.params;
  const get = await getEnrollmentById(id);

  ctx.body = get;
});

export { router };
