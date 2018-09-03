import * as log from 'loglevel';

import { environment } from '@env/environment';

const mainRoute = '/user';

log.setLevel(environment.production ? 'warn' : 'debug');

export { mainRoute };
