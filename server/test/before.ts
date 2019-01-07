/* tslint-env mocha */
/* tslint prefer-arrow-callback: "off" */
/* tslint import/no-extraneous-dependencies: "off" */

import 'mocha';
import { setSecret } from '../../server/src/controllers/utils/encryption';
import { init as initdb } from '../../server/src/database';
import { initServerConfig } from '../../server/src/boot.server-config';

before((done) => {
  (async () => {
    console.log('Initializing test secret...');
    setSecret('test');

    try {
      await initdb();
      await initServerConfig();
    } catch (err) {
      done(err);
    }

    done();
  })();
});
