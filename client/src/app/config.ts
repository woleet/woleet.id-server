import * as log from 'loglevel';

import { environment } from '@env/environment';

export const mainRoute = '/user';

log.setLevel(environment.production ? 'warn' : 'debug');

export const keys = {
  LOGIN_REDIRECT: 'login-redirect'
};
