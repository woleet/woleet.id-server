import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { keys, mainRoute } from '@app/config';

import * as log from 'loglevel';
import { LocalStorageService } from '@services/local-storage';
import { AppConfigService } from '@services/boot';
import { AuthService } from '@services/auth';
import { redirectForOIDCProvider } from '@services/util';

const LOGIN_REDIRECT_KEY = keys.LOGIN_REDIRECT;

@Component({
  templateUrl: './index.html'
})
export class OAuthRedirectComponent {

  errorMsg: string = null;
  redirect: string;

  constructor(
    activatedRoute: ActivatedRoute,
    authService: AuthService,
    configService: AppConfigService,
    router: Router,
    store: LocalStorageService) {
    activatedRoute.queryParams.subscribe(async (params) => {
      const config = configService.getConfig();

      log.debug('Forward oauth parameters', params);
      try {
        const user = await authService.forwardOAuth(params);
        log.debug('Successfully logged in', user);

        this.redirect = store.get(LOGIN_REDIRECT_KEY);
        if (this.redirect) {
          redirectForOIDCProvider(store, config, this.redirect);
        } else {

          if (user) {
            if (user.role === 'admin' || user.role === 'manager') {
              router.navigate(['users']);
            } else {
              router.navigate([mainRoute]);
            }
          } else {
            this.errorMsg = 'Unable to login';
          }
        }
      } catch (err) {
        log.error(err);
        this.errorMsg = `Unable to login: ${err.error.message}`;
      }
    });
  }
}
