import * as Router from 'koa-router';

import { store as event } from '../../controllers/server-event';
import { sendKeyEnrollmentEmail } from '../../controllers/send-email';
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
router.post('/enrollment', async function (ctx) {
  const { email } = ctx.request.body;
  let user;

  if (!email) {
    throw new BadRequest('Need to send the email address.');
  }

  try {
    user = await sendKeyEnrollmentEmail(email);
  } catch (err) {
    throw new NotFound(email + ' does not correspond to a user.');
  }

  event.register({
    type: 'enrollment.create',
    authorizedUserId: null,
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: null
  });

  ctx.body = '';
});

export { router };
