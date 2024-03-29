import { router as auth } from './routers/authentication';
import { router as appConfig } from './routers/app-config';
import { router as serverConfig } from './routers/server-config';
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
import { admin as adminAuth, manager as managerAuth, session, user as userAuth, token } from './authentication';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';

/**
 * API
 */
const apiRouter = new Router();
apiRouter.use(bodyParser());
apiRouter.use(healthcheck.routes());
apiRouter.use(session);
apiRouter.use(auth.routes());
apiRouter.use(token);
apiRouter.use(appConfig.routes());
apiRouter.use(openid.routes());
apiRouter.use(passwordReset.routes());
apiRouter.use(enrollmentPublic.routes());
apiRouter.use(userAuth);
apiRouter.use(info.routes());
apiRouter.use(managerAuth);
apiRouter.use(apiToken.routes());
apiRouter.use(user.routes());
apiRouter.use(key.routes());
apiRouter.use(enrollmentAdmin.routes());
apiRouter.use(serverConfig.routes());
apiRouter.use(adminAuth);

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
