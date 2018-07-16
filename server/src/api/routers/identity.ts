import * as Router from "koa-router";
import { serialiseUserDTO } from "../serialize/userDTO";


/**
 * Identity
 * Request handlers for identity.
 * @swagger
 *  tags: [identity]
 */

const router = new Router();

/**
 * @route: /indentity
 * @swagger
 *  operationId: getIdentity
 */
router.get('/indentity', async function (ctx) {
  ctx.body = serialiseUserDTO(ctx.session.user.toJSON())
});

export { router };
