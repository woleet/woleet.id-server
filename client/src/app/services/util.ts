import * as log from 'loglevel';

import { keys } from '@app/config';

import { environment } from '@env/environment';

const LOGIN_REDIRECT_KEY = keys.LOGIN_REDIRECT;

export function redirectForOIDCProvider(store, config, redirect) {
  store.del(LOGIN_REDIRECT_KEY);
  log.warn(`Redirect found on login path : interrupting workflow to perform redirection !`);
  if (config.useOpenIDConnect && config.OIDCPProviderURL) {
    log.info(`Performing redirection to ${redirect}`);
    document.location.href = config.OIDCPProviderURL + redirect;
  } else {
    log.warn(`Redirect found but OIDC is disabled`);
  }
}

export function redirectForOIDC() {
  document.location.href = `${environment.serverURL}/oauth/login`;
}
