import { Component } from '@angular/core';
import { AuthService } from '@services/auth';
import { mainRoute } from '@app/config';
import { Router } from '@angular/router';

import * as log from 'loglevel';
import { Observable } from 'rxjs';
import { AppConfigService } from '@services/boot';
import { keys } from '@app/config';
import { LocalStorageService } from '@services/local-storage';
import { redirectForOIDCProvider } from '@services/util';

const LOGIN_REDIRECT_KEY = keys.LOGIN_REDIRECT;

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class LoginPageComponent {

  user: BasicAuthObject;
  lock$: Observable<boolean>;

  errorMsg: string = null;
  useOIDC: boolean;
  config: { OIDCPProviderURL: string; useOpenIDConnect: boolean; };

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: LocalStorageService,
    appConfigService: AppConfigService) {
    this.user = { username: '', password: '' };
    this.lock$ = authService.lock$;
    const config = this.config = appConfigService.getStartupConfig();
    this.useOIDC = config && config.useOpenIDConnect;
  }

  async login() {
    const user = await this.authService.login(this.user);
    log.debug('Successfully logged in', user);

    const redirect = this.store.get(LOGIN_REDIRECT_KEY);
    if (redirect) {
      redirectForOIDCProvider(this.store, this.config, redirect);
    }

    if (user) {
      if (user.role === 'admin') {
        this.router.navigate(['users']);
      } else {
        this.router.navigate([mainRoute]);
      }
    } else {
      this.errorMsg = 'Failed to login.';
    }
  }

  openid() {
    return this.authService.openid();
  }
}
