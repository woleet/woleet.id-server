import { router as auth } from "./routers/authentication";
import { router as apiKey } from "./routers/api-key";
import { router as info } from "./routers/info";
import { router as user } from "./routers/user";
import { router as key } from "./routers/key";

import { user as userAuth, admin as adminAuth } from "./authentication"

import * as Router from "koa-router";

import session from './session';

const router = new Router();

/**
 * Route : /
 */
router.get('/', function (ctx) {
  ctx.body = { message: 'welcome' };
});

router.use(auth.routes());
router.use(session, userAuth, info.routes());
router.use(session, adminAuth, user.routes());
router.use(session, adminAuth, key.routes());
router.use(session, adminAuth, apiKey.routes());

export { router as api };
