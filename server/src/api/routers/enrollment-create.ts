import * as Router from 'koa-router';
import { validate } from '../schemas';
import { BadRequest, MethodNotAllowed } from 'http-errors';

import { store as event } from '../../controllers/server-event';
import { createEnrollment, deleteEnrollment, putEnrollment, getAllEnrollment, getEnrollmentById } from '../../controllers/enrollment';
import { getServerConfig } from '../../controllers/server-config';

/**
 * Key enrollment
 * Request handlers for key enrollment.
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
  const enrollment: ApiPostEnrollmentObject = ctx.request.body;
  let newEnrollment: InternalEnrollmentObject;

  // TO DO: change this method with an end point to send the mail
  if (!enrollment.test) {
    if (!getServerConfig().useSMTP) {
      throw new MethodNotAllowed('SMTP Server not configurated.');
    }

    if (!getServerConfig().contact) {
      throw new MethodNotAllowed('Admin contact not configurated.');
    }

    if (!getServerConfig().webClientURL) {
      throw new MethodNotAllowed('Web client URL not configurated.');
    }

    if (!getServerConfig().proofDeskAPIIsValid) {
      throw new MethodNotAllowed('ProofDesk account not configurated.');
    }
  }

  try {
    newEnrollment = await createEnrollment(enrollment);
  } catch (err) {
    throw err;
  }

  event.register({
    type: 'enrollment.create',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: newEnrollment.userId,
    associatedKeyId: null,
    data: null
  });

  ctx.body = newEnrollment;
});

router.put('/enrollment/:id', async function (ctx) {
  const enrollment: ApiPutEnrollmentObject = ctx.request.body;
  const { id } = ctx.params;
  const update = await putEnrollment(id, enrollment);

  event.register({
    type: 'enrollment.create',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: update.userId,
    associatedKeyId: null,
    data: null
  });

  ctx.body = update;
});

/**
 * @route: /enrollment/list
 * @swagger
 *  operationId: getAllEnrollment
 */
router.get('/enrollment/list', async function (ctx) {
  const enrollments = await getAllEnrollment();
  ctx.body = enrollments.map(enrollment => enrollment);
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
    data: deleted
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
  const enrollment = await getEnrollmentById(id);

  ctx.body = enrollment;
});

export { router };
