import * as Router from 'koa-router';
import * as body from 'koa-body';
import { BadRequest } from 'http-errors';
import { validate } from '../schemas';
import { defaultTCU, getServerConfig, setServerConfig, updateTCU } from '../../controllers/server-config';
import { store as event } from '../../controllers/server-event';
import { serializeServerConfig } from '../serialize/server-config';
import { getKeyById, getOwner } from '../../controllers/key';
import { admin } from '../authentication';

/**
 * ServerConfig
 */

const router = new Router({ prefix: '/server-config' });

/**
 * @route: /config
 * @swagger
 *  operationId: getServerConfig
 */
router.get('/', function (ctx) {
  ctx.body = serializeServerConfig(getServerConfig());
});

router.use(admin);

/**
 * @route: /config
 * @swagger
 *  operationId: updateServerConfig
 */
router.put('/', validate.body('updateConfig'), async function (ctx) {
  let config;

  if (ctx.request.body.defaultKeyId) {
    const key = await getKeyById(ctx.request.body.defaultKeyId);
    if (!key.privateKey) {
      throw new BadRequest('The server default key cannot be an extern key');
    }
    const owner = await getOwner(key.id);
    if (owner.mode === 'esign') {
      throw new BadRequest('The server default key cannot be an e-signature key');
    }
  }

  config = await setServerConfig(ctx.request.body);

  event.register({
    type: 'config.edit',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: null,
    data: ctx.request.body
  });

  ctx.body = serializeServerConfig(config);
});

router.post('/TCU', body({ multipart: true }), async function (ctx) {

  const file = ctx.request.files.file;
  try {
    await updateTCU(file);
  } catch {
    throw new BadRequest('Cannot upload this file');
  }

  event.register({
    type: 'config.edit',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: null,
    data: 'TCU updated'
  });

  ctx.body = { response: 'TCU updated' };
});

router.get('/TCU/default', async function (ctx) {

  await defaultTCU();

  event.register({
    type: 'config.edit',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: null,
    data: 'default TCU'
  });

  ctx.body = { response: 'default TCU' };
});

export { router };
