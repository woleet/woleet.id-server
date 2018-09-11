import * as Debug from 'debug';
import * as log from 'loglevel';

import wait from './controllers/utils/wait';
import { createUser } from './controllers/user';
import { setServerConfig, loadServerConfig } from './controllers/server-config';

const debug = Debug('id:startup');

wait(1000)
  .then(() => {
    return loadServerConfig();
  })
  .then((config) => {
    if (config) {
      log.info(`Got server config: ${JSON.stringify(config, null, 2)}`);
    } else {
      log.warn('No configuration found in database');
    }
  })
  .catch((err) => log.warn(`Failed to load server config: ${err.message}`))
  .then(() => {
    debug('Creating admin user');
    return createUser({
      password: 'pass',
      role: 'admin',
      username: 'admin',
      identity: {
        commonName: 'Admin',
        organization: 'UNDEFINED',
        organizationalUnit: 'UNDEFINED',
        locality: 'UNDEFINED',
        userId: 'admin'
      }
    });
  })
  .then((admin) => {
    log.info(`Created user "admin" with id ${admin.id}`);
    return setServerConfig({ defaultKeyId: admin.defaultKeyId });
  })
  .then((config) => {
    log.info(`Created new server configuration with settings: ${JSON.stringify(config, null, 2)}`);
  })
  .catch((err) => log.warn(`Failed to create user "admin": ${err.message}`))
  .then(() => {
    debug('Creating tester user');
    return createUser({
      password: 'pass',
      role: 'user',
      username: 'tester',
      identity: {
        commonName: 'Tester',
        userId: 'tester'
      }
    });
  })
  .then(() => log.info('Created user "tester"'))
  .catch((err) => log.warn(`Failed to create user "tester": ${err.message}`));
