import * as Router from 'koa-router';
import { validate } from '../schemas';

import { store as event } from '../../controllers/server-event';
import { createEnrollment } from '../../controllers/enrollment';
import { BadRequest, NotFound } from 'http-errors';

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

  try {
    newEnrollment = await createEnrollment(enrollment);
  } catch (err) {
    throw err;
  }

  event.register({
    type: 'enrollment.create',
    authorizedUserId: null,
    associatedTokenId: null,
    associatedUserId: newEnrollment.userId,
    associatedKeyId: null,
    data: null
  });

  ctx.body = newEnrollment;
});

export { router };
