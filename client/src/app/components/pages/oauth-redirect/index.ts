import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mainRoute } from '@app/config';

import * as log from 'loglevel';
import { LocalStorageService } from '@services/local-storage';
import { AppConfigService } from '@services/boot';
import { AuthService } from '@services/auth';
import { keys } from '@app/config';
import { redirectForOIDCProvider } from '@services/util';

const LOGIN_REDIRECT_KEY = keys.LOGIN_REDIRECT;

@Component({
  templateUrl: './index.html'
})
export class OAuthRedirectComponent {

  errorMsg: string = null;

  constructor(
    activatedRoute: ActivatedRoute,
    authService: AuthService,
    configService: AppConfigService,
    router: Router,
    store: LocalStorageService) {
    activatedRoute.queryParams.subscribe(async (params) => {
      const config = configService.getStartupConfig();

      log.debug('Forward oauth parameters', params);
      try {
        const user = await authService.forwardOAuth(params);
        log.debug('Successfully logged in', user);

        const redirect = store.get(LOGIN_REDIRECT_KEY);
        if (redirect) {
          redirectForOIDCProvider(store, config, redirect);
        }

        if (user) {
          if (user.role === 'admin') {
            router.navigate(['users']);
          } else {
            router.navigate([mainRoute]);
          }
        } else {
          this.errorMsg = `Failed to login`;
        }
      } catch (err) {
        log.error(err);
        this.errorMsg = `Failed to login: ${err.error.message}`;
      }

    });
  }

}
