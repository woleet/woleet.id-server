import * as Debug from 'debug';
import * as log from 'loglevel';

import { randomBytes } from 'crypto';
import { Key } from './database';
import { createUser } from './controllers/user';
import { setServerConfig, loadServerConfig } from './controllers/server-config';

const debug = Debug('id:boot');

// Config
import { encryption, serverConfig } from './config';
import { setSecret } from './controllers/utils/encryption';
import { initPromise } from './database';
import { signMessage } from './controllers/sign';
import { configure as initOpenIDConnect } from './controllers/openid';
import { configure as initalizeOIDCProvider } from './controllers/oidc-provider';
import { bootServers } from './boot.servers';
import { exit } from './exit';

initPromise
  .then(() => encryption.init())
  .then(() => {
    setSecret(encryption.secret);
    log.info('Secret successfully initialized');
  })
  .catch((err) => exit(`Failed to init secret: ${err.message}`, err))
  .then(() => loadServerConfig())
  .then(async (config) => {
    if (config) {
      log.info(`Server configuration successfully restored`);
      debug(JSON.stringify(config, null, 2));

      const key = await Key.getAny();

      if (!key) {
        log.warn('Not any key in database, cannot check secret restoration');
        return;
      }

      try {
        await signMessage(key.get('privateKey'), randomBytes(32).toString('hex'), key.get('compressed'));
      } catch (err) {
        log.warn(err.message);
        throw new Error('Secret is not the same that the previously set one');
      }

    } else {
      log.warn('No configuration found in database, creating a new one along with a default admin user...');
      debug('Creating an admin user');
      let admin;
      try {
        admin = await createUser({
          password: 'pass',
          role: 'admin',
          username: 'admin',
          identity: { commonName: 'Admin' }
        });
      } catch (err) {
        return exit(`Failed to create user "admin": ${err.message}`, err);
      }

      log.info(`Created user "admin" with id ${admin.id}`);

      const conf = await setServerConfig(Object.assign({}, serverConfig.default, { defaultKeyId: admin.defaultKeyId }));
      log.info(`Created new server configuration with defaults: ${JSON.stringify(conf, null, 2)}`);
    }
  })
  .catch((err) => exit(`Failed to load server config: ${err.message}`, err))
  .then(async () => {
    try {
      await initOpenIDConnect();
      return;
    } catch (err) {
      log.error('Failed to initalize OPenID Connect, it will be automatically disabled !', err);
    }
    return setServerConfig({ useOpenIDConnect: false });
  })
  .then(async () => {
    try {
      await initalizeOIDCProvider();
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
