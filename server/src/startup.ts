import * as Debug from 'debug';
const debug = Debug('id:startup');

import wait from './controllers/utils/wait';
import { createUser } from './controllers/user';

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
  .then(() => debug('Created admin user'))
  .catch((err) => console.warn(`Failed to create admin user: ${err.message}`));
