import { validate } from '../schemas';
import * as Router from 'koa-router';

import { externalCreateKey } from '../../controllers/key';
import { serializeKey } from '../serialize/key';
import { store as event } from '../../controllers/server-event';
import { sendKeyEnrolmentEmail } from '../../controllers/send-email';
import { serializeUser } from '../serialize/user';
import { BadRequest, NotFound } from 'http-errors';
import { getOwner, getTCUHash, createSignatureRequest } from '../../controllers/onboarding';
import { admin as adminAuth } from '../authentication';

const vuid = validate.param('userId', 'uuid');

/**
 * Key
 * Request handlers for key by user.
 * @swagger
 *  tags: [external-key]
 */
const router = new Router({ prefix: '/external-key' });

/**
 * @route: /external-key/enrolment/{id}
 * @swagger
 *  operationId: enrolment
 */
router.get('/enrolment/:id', async function (ctx) {
  const { id } = ctx.params;
  let user;
  try {
    user = await getOwner(id);
  } catch {
    throw new NotFound('This demand is not available.');
  }
  ctx.body = serializeUser(user);
});

/**
 * @route: /external-key/enrolment/finalize
 * @swagger
 *  operationId: enrolment
 */
router.post('/enrolment/finalize', async function (ctx) {
  const { email } = ctx.request.body;

  const hashTCU = await getTCUHash();

  try {
    createSignatureRequest(hashTCU, email);
  } catch (error) {
    console.log(error);
  }

  ctx.body = 'ok';
});

router.use(adminAuth);

/**
 * @route: /external-key/create
 * @swagger
 *  operationId: createKey
 */
router.post('/create/:userId', vuid, validate.body('createKey'), async function (ctx) {
  const { userId } = ctx.params;
  const key: ApiPostKeyObject = ctx.request.body;

  let created;

  try {
    created = await externalCreateKey(userId, key);
  } catch (error) {
    throw new BadRequest(error);
  }

  event.register({
    type: 'key.create',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: created.id,
    data: key
  });

  ctx.body = serializeKey(created);
});

/**
 * @route: /external-key/enrolment
 * @swagger
 *  operationId: enrolment
 */
router.post('/enrolment', async function (ctx) {
  const { email } = ctx.request.body;
  let user;

  if (!email) {
    throw new BadRequest('Need to send the email address.');
  }

  try {
    user = await sendKeyEnrolmentEmail(email);
  } catch {
    throw new NotFound(email + ' does not correspond to a user.');
  }

  event.register({
    type: 'user.edit',
    authorizedUserId: null,
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: null
  });

  ctx.body = '';
});

export { router };
