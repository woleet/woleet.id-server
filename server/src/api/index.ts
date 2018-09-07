import { router as auth } from './routers/authentication';

import { router as serverEvent } from './routers/server-event';
import { router as apiToken } from './routers/api-token';
import { router as info } from './routers/info';
import { router as user } from './routers/user';
import { router as key } from './routers/key';

import { router as sign } from './routers/sign';
import { router as identity } from './routers/identity';

import { user as userAuth, admin as adminAuth, session, basicAuth } from './authentication';

import * as Router from 'koa-router';

import * as bodyParser from 'koa-bodyparser';

/**
 * API
 */
const apiRouter = new Router();
apiRouter.use(bodyParser());
apiRouter.use(auth.routes());
apiRouter.use(session, basicAuth, userAuth, info.routes());
apiRouter.use(session, basicAuth, adminAuth, user.routes());
apiRouter.use(session, basicAuth, adminAuth, key.routes());
apiRouter.use(session, basicAuth, adminAuth, apiToken.routes());
apiRouter.use(session, basicAuth, adminAuth, serverEvent.routes());

/**
 * Identity
 */
const identityRouter = new Router();
identityRouter.use(identity.routes());

/**
 * Signature
 */
const signatureRouter = new Router();
signatureRouter.use(sign.routes());

export {
  apiRouter as api,
  identityRouter as identity,
  signatureRouter as signature
};
