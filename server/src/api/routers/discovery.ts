import { validate } from '../schemas';
import * as Router from 'koa-router';
import { getAllKeysOfUser, getOwnerByPubKey } from '../../controllers/key';
import { buildUserFilterFromQueryParams, serializeUser } from '../serialize/user';
import { getUserById, getUsers } from '../../controllers/user';
import { bearerAuth } from '../authentication';
import { getServerConfig } from '../../controllers/server-config';
import { serializeKey } from '../serialize/key';
import { FindOptions } from 'sequelize';

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
  const APIVersion = process.env.WOLEET_ID_SERVER_API_VERSION;
  const { identityURL, signatureURL, APIURL } = await getServerConfig();
  ctx.body = { identityURL, signatureURL, APIURL, APIVersion };
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
  const query = ctx.query;
  const opts: FindOptions = { where: buildUserFilterFromQueryParams(query), offset: query.offset, limit: query.limit };
  const users = await getUsers(opts);
  ctx.body = users.map((user) => serializeUser(user, false));
});

export { router };
