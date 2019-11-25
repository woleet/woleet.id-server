import { validate } from '../schemas';
import * as Router from 'koa-router';
import { BadRequest } from 'http-errors';

import { getAllKeysOfUser, getOwnerByPubKey } from '../../controllers/key';
import { serializeUser } from '../serialize/user';
import { getUserById, searchAllUsers } from '../../controllers/user';
import { bearerAuth } from '../authentication';
import { getServerConfig } from '../../controllers/server-config';
import { serializeKey } from '../serialize/key';

const vuid = validate.param('userId', 'uuid');
const vaddr = validate.param('pubKey', 'address');

/**
 * Discovery
 * Request handlers for discovery features.
 * @swagger
 *  tags: [discovery]
 */

const router = new Router({ prefix: '/discover' });

/**
 * @route: /discover/config
 * @swagger
 *  operationId: discoverConfig
 */
router.get('/config', async function (ctx) {
  const { identityURL, APIURL } = await getServerConfig();
  ctx.body = { identityURL, APIURL };
});

router.use(bearerAuth);

/**
 * @route: /discover/keys/{userId}
 * @swagger
 *  operationId: discoverUserKeys
 */
router.get('/keys/:userId', vuid, async function (ctx) {
  const { userId } = ctx.params;
  const keys = await getAllKeysOfUser(userId);
  ctx.body = keys.map(serializeKey);
});

/**
 * @route: /discover/user/{pubKey}
 * @swagger
 *  operationId: discoverUserByPubKey
 */
router.get('/user/:pubKey', vaddr, async function (ctx) {
  const { pubKey } = ctx.params;
  const user = await getOwnerByPubKey(pubKey);
  ctx.body = serializeUser(user, false);
});

/**
 * @route: /discover/user
 * @swagger
 *  operationId: discoverUser
 */
router.get('/user', async function (ctx) {
  const token = ctx.token;

  const userId = token.userId;
  if (userId) {
  const user = await getUserById(userId);
  ctx.body = serializeUser(user, false);
} else {
  ctx.body = null;
}
});


/**
 * @route: /discover/users
 * @swagger
 *  operationId: discoverUsers
 */
router.get('/users', async function (ctx) {
  const { search } = ctx.query;
  if (!search) {
    throw new BadRequest('Missing "search" parameter');
  }
  const users = await searchAllUsers(search);
  ctx.body = users.map((user) => serializeUser(user, false));
});

export { router };
