import { router as auth } from "./routers/authentication";
import { router as apiKey } from "./routers/api-key";
import { router as info } from "./routers/info";
import { router as user } from "./routers/user";
import { router as key } from "./routers/key";

import { router as sign } from "./routers/sign";
import { router as identity } from "./routers/identity";

import { user as userAuth, admin as adminAuth, session } from "./authentication"

import * as Router from "koa-router";

const router = new Router();

/**
 * Route : /
 */
router.get('/', function (ctx) {
  ctx.body = { message: 'welcome' };
});


router.use(sign.routes());
router.use(identity.routes());

router.use(auth.routes());
router.use(session, userAuth, info.routes());
router.use(session, adminAuth, user.routes());
router.use(session, adminAuth, key.routes());
router.use(session, adminAuth, apiKey.routes());

export { router as api };
