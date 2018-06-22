import { router as auth } from "./authentication";
import { router as info } from "./info";
import { router as user } from "./user";
import { router as key } from "./key";

import * as Router from "koa-router";

import session from '../session';

const router = new Router();

/**
 * Route : /
 */
router.get('/', function (ctx) {
  ctx.body = { message: 'welcome' };
});

router.use(auth.routes());
router.use(session, info.routes());
router.use(session, user.routes());
router.use(session, key.routes());

export { router as api };
