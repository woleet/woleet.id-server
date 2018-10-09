import { router as auth } from './routers/authentication';

import { router as serverConfig } from './routers/server-config';
import { router as serverEvent } from './routers/server-event';
import { router as apiToken } from './routers/api-token';
import { router as info } from './routers/info';
import { router as user } from './routers/user';
import { router as key } from './routers/key';

import { router as sign } from './routers/sign';
import { router as identity } from './routers/identity';

import { user as userAuth, admin as adminAuth, session } from './authentication';

import { production } from '../config';

import * as cors from '@koa/cors';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';

/**
 * API
 */
const apiRouter = new Router();
if (!production) {
  apiRouter.use(cors({ credentials: true }));
}
apiRouter.use(bodyParser());
apiRouter.use(auth.routes());
apiRouter.use(session, userAuth, info.routes());
apiRouter.use(session, adminAuth, user.routes());
apiRouter.use(session, adminAuth, key.routes());
apiRouter.use(session, adminAuth, apiToken.routes());
apiRouter.use(session, adminAuth, serverEvent.routes());
apiRouter.use(session, adminAuth, serverConfig.routes());

/**
 * Identity
 */
const identityRouter = new Router();
identityRouter.use(cors());
identityRouter.use(identity.routes());

/**
 * Signature
 */
const signatureRouter = new Router();
if (!production) {
  signatureRouter.use(cors({ credentials: true }));
}
signatureRouter.use(sign.routes());

export {
  apiRouter as api,
  identityRouter as identity,
  signatureRouter as signature
};
