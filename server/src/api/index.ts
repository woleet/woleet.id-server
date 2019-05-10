import { router as auth } from './routers/authentication';
import { router as appConfig } from './routers/app-config';

import { router as serverConfig } from './routers/server-config';
import { router as serverEvent } from './routers/server-event';
import { router as apiToken } from './routers/api-token';
import { router as info } from './routers/info';
import { router as externalKey } from './routers/external-key';
import { router as user } from './routers/user';
import { router as key } from './routers/key';
import { router as passwordReset } from './routers/passwordReset';

import { router as sign } from './routers/sign';
import { router as identity } from './routers/identity';
import { router as discovery } from './routers/discovery';

import { router as openid } from './routers/openid';

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
apiRouter.use(session);
apiRouter.use(appConfig.routes());
apiRouter.use(openid.routes());
apiRouter.use(passwordReset.routes());
apiRouter.use(userAuth);
apiRouter.use(info.routes());
apiRouter.use(adminAuth);
apiRouter.use(externalKey.routes());
apiRouter.use(user.routes());
apiRouter.use(key.routes());
apiRouter.use(apiToken.routes());
apiRouter.use(serverEvent.routes());
apiRouter.use(serverConfig.routes());

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
signatureRouter.use(discovery.routes());

export {
  apiRouter as api,
  identityRouter as identity,
  signatureRouter as signature
};
