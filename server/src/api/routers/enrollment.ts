import * as Router from 'koa-router';

import { store as event } from '../../controllers/server-event';
import { serializeUser } from '../serialize/user';
import { BadRequest } from 'http-errors';
import { getOwner, getTCUHash, startKeyRegistration, monitorSignatureRequests } from '../../controllers/enrollment';
import log = require('loglevel');

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
  let user;
  try {
    user = await getOwner(id);
  } catch (err) {
    throw new BadRequest(err.name);
  }
  ctx.body = serializeUser(user);
});

/**
 * @route: /enrollment/:id/create-signature-request
 * @swagger
 *  operationId: finalizeEnrollment
 */
router.post('/enrollment/:id/create-signature-request', async function (ctx) {
  const { id } = ctx.params;
  let user;

  let response;

  try {
    user = await getOwner(id);
    user = serializeUser(user);
  } catch (err) {
    throw new BadRequest(err.name);
  }

  try {
    await startKeyRegistration(id)
      .then((res: any) => {
        response = res;
      });
  } catch (error) {
    log.error(error);
  }

  monitorSignatureRequests(response.id, id, user);

  event.register({
    type: 'enrollment.create-signature-request',
    authorizedUserId: null,
    associatedTokenId: null,
    associatedUserId: serializeUser(user).id,
    associatedKeyId: null,
    data: JSON.stringify(response)
  });

  ctx.body = JSON.stringify(response.id);
});

export { router };
