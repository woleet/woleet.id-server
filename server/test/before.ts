/* tslint-env mocha */
/* tslint prefer-arrow-callback: "off" */
/* tslint import/no-extraneous-dependencies: "off" */

import 'mocha';
import { secureModule } from '../../server/src/config';
import { init as initdb } from '../../server/src/database';
import { initServerConfig } from '../../server/src/boot.server-config';

before(() => {
  return (async () => {
    console.log('Initializing test secret...');
    process.env.__test_secret = 'test';
    await secureModule.init('__test_secret');

    await initdb();
    await initServerConfig();
  })();
});
