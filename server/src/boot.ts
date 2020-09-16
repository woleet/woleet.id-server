
import {
  registerOIDCPBootFunction, registerOIDCPStopFunction, registerOIDCPUpdateFunction, registerOIDCUpdateFunction,
  registerSMTPUpdateFunction, setServerConfig
} from './controllers/server-config';
// Config
import { secretEnvVariableName, secureModule } from './config';
import { afterinit as afterinitdb, init as initdb, postinit as postinitdb } from './database';
import { initializeOIDC, updateOIDC } from './controllers/openid';
import { initializeSMTP, updateSMTP } from './controllers/smtp';
import { initializeOIDCProvider, stopOIDCProvider, updateOIDCProvider } from './controllers/oidc-provider';
import { bootOIDCProvider, bootServers } from './boot.servers';
import { initServerConfig } from './boot.server-config';
import { exit } from './exit';
import { doLockByCache } from './lockByCache';
import * as log from 'loglevel';

async function _boot() {
  await initdb()
  .catch((err) => exit(`Cannot initialize database: ${err.message}`, err))
  .then((isFirst) => {
    if (isFirst) {
      log.warn(`${secretEnvVariableName} secret is used to encrypt your keys. ` +
        `You can set it as an environmental variable or enter it each time you restart Woleet.ID Server. ` +
        `Without this secret you cannot recover your keys.`);
    }
  })
  .then(() => secureModule.init(secretEnvVariableName))
  .then(() => {
    log.info('Secure module successfully initialized');
  })
  .catch((err) => exit(`Cannot initialize secret: ${err.message}`, err))
  .then(() => postinitdb())
  .then(() => initServerConfig())
  .catch((err) => exit(`Cannot initialize server config: ${err.message}`, err))
  .then(() => afterinitdb())
  .then(() => registerOIDCUpdateFunction(updateOIDC))
  .then(() => registerOIDCPBootFunction(bootOIDCProvider))
  .then(() => registerOIDCPStopFunction(stopOIDCProvider))
  .then(() => registerOIDCPUpdateFunction(updateOIDCProvider))
  .then(() => registerSMTPUpdateFunction(updateSMTP))
  .then(async () => {
    try {
      await initializeOIDC();
      return;
    } catch (err) {
      log.error('Cannot initialize OpenID Connect, it will be automatically disabled!', err);
    }
    return setServerConfig({ enableOpenIDConnect: false });
  })
  .then(async () => {
    try {
      await initializeOIDCProvider();
      return;
    } catch (err) {
      log.error('Cannot initialize OpenID Connect Provider, it will be automatically disabled!', err);
    }
  })
  .then(async () => {
    try {
      await initializeSMTP();
      return;
    } catch (err) {
      log.error('Cannot initialize SMTP, it will be automatically disabled!', err);
    }
    return setServerConfig({ enableSMTP: false });
  })
  .catch((err) => exit(`Cannot update server config: ${err.message}`, err))
  .then(() => bootServers())
  .catch((err) => exit(`Cannot start servers: ${err.message}`, err))
  .then(() => log.info('All done. You can now detach the CLI (ctrl+c)'));
}

doLockByCache('boot', _boot);
