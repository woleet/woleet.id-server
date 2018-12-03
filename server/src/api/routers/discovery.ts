import { validate } from '../schemas';
import * as Router from 'koa-router';

import { getOwnerByPubKey, getAllKeysOfUser } from '../../controllers/key';
import { serialiseKey } from '../serialize/key';
import { serialiseUser } from '../serialize/user';
import { getAllUsers } from '../../controllers/user';
import { bearerAuth } from '../authentication';

const vuid = validate.param('userId', 'uuid');
const vaddr = validate.param('pubKey', 'address');

/**
 * Discovery
 * Request handlers for dicovery features.
 * @swagger
 *  tags: [discovery]
 */

const router = new Router({ prefix: '/discovery' });

router.use(bearerAuth);

/**
 * @route: /discover/keys/{userId}
 * @swagger
 *  operationId: discoverUserKeys
 */
router.get('/keys/:userId', vuid, async function (ctx) {
  const { userId } = ctx.params;
  const keys = await getAllKeysOfUser(userId);
  ctx.body = keys.map(serialiseKey);
});

/**
 * @route: /discover/user/{pubKey}
 * @swagger
 *  operationId: discoverUserByPubKey
 */
router.get('/user/:pubKey', vaddr, async function (ctx) {
  const { pubKey } = ctx.params;
  const user = await getOwnerByPubKey(pubKey);
  ctx.body = serialiseUser(user, false);
});

/**
 * @route: /discover/users
 * @swagger
 *  operationId: discoverUsers
 */
router.get('/users', async function (ctx) {
  const users = await getAllUsers();
  ctx.body = users.map((user) => serialiseUser(user, false));
});

export { router };
