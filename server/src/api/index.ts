import { router as auth } from './routers/authentication';
import { router as appConfig } from './routers/app-config';
import { router as serverConfig } from './routers/server-config';
import { router as serverEvent } from './routers/server-event';
import { router as apiToken } from './routers/api-token';
import { router as info } from './routers/info';
import { router as enrollmentPublic } from './routers/enrollment-public';
import { router as enrollmentAdmin } from './routers/enrollment-admin';
import { router as user } from './routers/user';
import { router as key } from './routers/key';
import { router as passwordReset } from './routers/password-reset';
import { router as sign } from './routers/sign';
import { router as identity } from './routers/identity';
import { router as discovery } from './routers/discovery';
import { router as openid } from './routers/openid';
import { router as healthcheck } from './routers/healthcheck';
import { admin as adminAuth, session, user as userAuth, manager as managerAuth } from './authentication';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { from } from 'rxjs';

/**
 * API
 */
const apiRouter = new Router();
apiRouter.use(bodyParser());
apiRouter.use(healthcheck.routes());
apiRouter.use(auth.routes());
apiRouter.use(session);
apiRouter.use(appConfig.routes());
apiRouter.use(openid.routes());
apiRouter.use(passwordReset.routes());
apiRouter.use(enrollmentPublic.routes());
apiRouter.use(userAuth);
apiRouter.use(info.routes());
apiRouter.use(managerAuth);
apiRouter.use(user.routes());
apiRouter.use(key.routes());
apiRouter.use(enrollmentAdmin.routes());
apiRouter.use(serverConfig.routes());
apiRouter.use(apiToken.routes());
apiRouter.use(adminAuth);
apiRouter.use(serverEvent.routes());

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
signatureRouter.use(discovery.routes());

export {
  apiRouter as api,
  identityRouter as identity,
  signatureRouter as signature
};
