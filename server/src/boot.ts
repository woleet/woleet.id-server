import * as log from 'loglevel';

import { setServerConfig } from './controllers/server-config';
import {
  registerOIDCPStopFunction,
  registerOIDCPBootFunction,
  registerOIDCUpdateFunction,
  registerOIDCPUpdateFunction
} from './controllers/server-config';

// Config
import { encryption } from './config';
import { setSecret } from './controllers/utils/encryption';
import { init as initdb } from './database';
import { initializeOIDC, updateOIDC } from './controllers/openid';
import { initializeOIDCProvider, stopOIDCProvider, updateOIDCProvider } from './controllers/oidc-provider';
import { bootServers, bootOIDCProvider } from './boot.servers';
import { initServerConfig } from './boot.server-config';
import { exit } from './exit';

initdb()
  .catch((err) => exit(`Failed to init database: ${err.message}`, err))
  .then(() => encryption.init())
  .then(() => {
    setSecret(encryption.secret);
    log.info('Secret successfully initialized');
  })
  .catch((err) => exit(`Failed to init secret: ${err.message}`, err))
  .then(() => initServerConfig())
  .catch((err) => exit(`Failed to init server config: ${err.message}`, err))
  .then(() => registerOIDCUpdateFunction(updateOIDC))
  .then(() => registerOIDCPBootFunction(bootOIDCProvider))
  .then(() => registerOIDCPStopFunction(stopOIDCProvider))
  .then(() => registerOIDCPUpdateFunction(updateOIDCProvider))
  .then(async () => {
    try {
      await initializeOIDC();
      return;
    } catch (err) {
      log.error('Failed to initalize OPenID Connect, it will be automatically disabled !', err);
    }
    return setServerConfig({ useOpenIDConnect: false });
  })
  .then(async () => {
    try {
      await initializeOIDCProvider();
      return;
    } catch (err) {
      log.error('Failed to initalize OPenID Connect Provider, it will be automatically disabled !', err);
    }
  })
  .catch((err) => exit(`Failed to update server config: ${err.message}`, err))
  .then(() => bootServers())
  .catch((err) => exit(`Failed to start servers: ${err.message}`, err))
  .then(() => log.info('All done. You can now detach the CLI (ctrl+c)'))
  ;
