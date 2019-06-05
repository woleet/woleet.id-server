import { validate } from '../schemas';
import * as Router from 'koa-router';
import { BadRequest } from 'http-errors';

import { getOwnerByPubKey, DiscoverKeysOfUser } from '../../controllers/key';
import { serializeKey } from '../serialize/key';
import { serializeUser } from '../serialize/user';
import { searchAllUsers, getUserById } from '../../controllers/user';
import { bearerAuth } from '../authentication';

const vuid = validate.param('userId', 'uuid');
const vaddr = validate.param('pubKey', 'address');

/**
 * Discovery
 * Request handlers for dicovery features.
 * @swagger
 *  tags: [discovery]
 */

const router = new Router({ prefix: '/discover' });

router.use(bearerAuth);

/**
 * @route: /discover/keys/{userId}
 * @swagger
 *  operationId: discoverUserKeys
 */
router.get('/keys/:userId', vuid, async function (ctx) {
  const { userId } = ctx.params;
  const keys = await DiscoverKeysOfUser(userId);
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
  const userId = ctx.token.userId;
  const user = await getUserById(userId);
  ctx.body = serializeUser(user, false);
});


/**
 * @route: /discover/users
 * @swagger
 *  operationId: discoverUsers
 */
router.get('/users', async function (ctx) {
  const { search } = ctx.query;

  if (!search) {
    throw new BadRequest('Missing "search" query parameter');
  }

  const users = await searchAllUsers(search);
  ctx.body = users.map((user) => serializeUser(user, false));
});

export { router };
