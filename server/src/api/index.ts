import { router as auth } from "./authentication"
import { router as user } from "./user"
import { router as key } from "./key"

import * as Router from "koa-router";

const router = new Router();

/**
 * Route : /
 */
router.get('/', function (ctx) {
  ctx.body = { message: 'welcome' };
});

router.use(auth.routes());
router.use(user.routes());
router.use(key.routes());

export { router as api };
