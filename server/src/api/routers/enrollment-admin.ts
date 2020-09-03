import * as Router from 'koa-router';
import { store as event } from '../../controllers/server-event';
import {
  createEnrollment, deleteEnrollment, getAllEnrollment, getEnrollmentById, putEnrollment
} from '../../controllers/enrollment';
import { validate } from '../schemas';
import { getServerConfig } from '../../controllers/server-config';
import { BadRequest, MethodNotAllowed } from 'http-errors';
import { serializeEnrollment } from '../serialize/enrollment';

/**
 * Key enrollment admin
 * Request handlers for key enrollment with admin access.
 * @swagger
 *  tags: [enrollment]
 */
const router = new Router();

/**
 * @route: /enrollment
 * @swagger
 *  operationId: createEnrollment
 */
router.post('/enrollment', validate.body('createEnrollment'), async function (ctx) {

  // Get enrollment to create from body
  const enrollment: ApiPostEnrollmentObject = ctx.request.body;

  // Verify all settings required for enrollment
  // TODO: change the test boolean by a new end point allowing to send the mail
  if (!enrollment.test) {
    if (!getServerConfig().enableSMTP) {
      throw new MethodNotAllowed('SMTP Server not configured');
    }
    if (!getServerConfig().contact) {
      throw new MethodNotAllowed('Admin contact not configured');
    }
    if (!getServerConfig().webClientURL) {
      throw new MethodNotAllowed('Web client URL not configured');
    }
    if (!getServerConfig().enableProofDesk) {
      throw new MethodNotAllowed('ProofDesk account not configured');
    }
  }

  // Verify that the expiration date is not set in the past
  if (enrollment.expiration != null && enrollment.expiration < Date.now()) {
    throw new BadRequest('Cannot set expiration date in the past');
  }

  // Verify that the key expiration date is not set in the past
  if (enrollment.keyExpiration != null && enrollment.keyExpiration < Date.now()) {
    throw new BadRequest('Cannot set key expiration date in the past');
  }

  // Create enrollment
  const created = await createEnrollment(enrollment);

  // Register enrollment creation event
  event.register({
    type: 'enrollment.create',
    authorizedUserId: ctx.session.userId,
    associatedTokenId: null,
    associatedUserId: created.userId,
    associatedKeyId: null,
    data: created.id
  });

  // Return created enrollment in body
  ctx.body = serializeEnrollment(created);
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
    authorizedUserId: ctx.session.userId,
    associatedTokenId: null,
    associatedUserId: updated.userId,
    associatedKeyId: null,
    data: id
  });

  ctx.body = serializeEnrollment(updated);
});

/**
 * @route: /enrollment/list
 * @swagger
 *  operationId: getAllEnrollments
 */
router.get('/enrollment/list', async function (ctx) {
  const enrollments = await getAllEnrollment();
  ctx.body = enrollments.map(serializeEnrollment);
});

router.delete('/enrollment/:id', async function (ctx) {
  const { id } = ctx.params;
  const deleted = await deleteEnrollment(id);

  event.register({
    type: 'enrollment.delete',
    authorizedUserId: ctx.session.userId,
    associatedTokenId: null,
    associatedUserId: deleted.userId,
    associatedKeyId: null,
    data: id
  });

  ctx.body = serializeEnrollment(deleted);
});

/**
 * @route: /enrollment/{id}
 * @swagger
 *  operationId: getEnrollment
 */
router.get('/enrollment/:id', async function (ctx) {
  const { id } = ctx.params;
  const get = await getEnrollmentById(id);

  ctx.body = serializeEnrollment(get);
});

export { router };
