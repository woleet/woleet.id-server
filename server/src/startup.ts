import * as Debug from 'debug';
import * as log from 'loglevel';

import wait from './controllers/utils/wait';
import { createUser } from './controllers/user';

const debug = Debug('id:startup');

wait(1000)
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
        country: 'UNDEFINED',
        userId: 'admin'
      }
    });
  })
  .then(() => log.info('Created user "admin"'))
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
