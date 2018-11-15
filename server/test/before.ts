/* tslint-env mocha */
/* tslint prefer-arrow-callback: "off" */
/* tslint import/no-extraneous-dependencies: "off" */

import 'mocha';
import { setSecret } from '../../server/src/controllers/utils/encryption';

before(() => {
  console.log('Initializing test secret...');
  setSecret('test');
});
