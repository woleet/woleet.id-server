import * as Router from 'koa-router';

import { store as event } from '../../controllers/server-event';
import { serializeUser } from '../serialize/user';
import { BadRequest } from 'http-errors';
import { getOwner, getTCUHash, createSignatureRequest, monitorSignatureRequests } from '../../controllers/enrollment';
import log = require('loglevel');

/**
 * Key enrollment
 * Request handlers for key enrollment.
 * @swagger
 *  tags: [enrollment]
 */
const router = new Router();

/**
 * @route: /enrollment/{id}
 * @swagger
 *  operationId: getEnrollment
 */
router.get('/enrollment/:id', async function (ctx) {
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
  const { email } = ctx.request.body;
  let user;

  const hashTCU = await getTCUHash();
  let response;

  try {
    user = await getOwner(id);
    user = serializeUser(user);
  } catch (err) {
    throw new BadRequest(err.name);
  }

  try {
    await createSignatureRequest(hashTCU, email)
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

  ctx.body = '';
});

export { router };
