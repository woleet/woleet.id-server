import { Component } from '@angular/core';
import { AuthService } from '@services/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { mainRoute } from '@app/config';

import * as log from 'loglevel';
import { Observable } from 'rxjs';
import { AppConfigService } from '@services/boot';
import { ErrorService } from '@services/error';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class LoginPageComponent {

  user: BasicAuthObject;
  lock$: Observable<boolean>;

  errorMsg: string = null;
  redirect: string;
  useOIDC: boolean;

  constructor(
    activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    errorService: ErrorService,
    appConfigService: AppConfigService) {
    this.user = { username: '', password: '' };
    this.lock$ = authService.lock$;
    const conf = appConfigService.getStartupConfig();
    this.useOIDC = conf && conf.useOpenIDConnect;
    activatedRoute.queryParams.subscribe(async (params) => {
      log.debug('Forwarded login parameters', params);
      if (params.origin && params.origin.startsWith('oidcp') && params.redirect) {
        try {
          this.redirect = atob(params.redirect);
        } catch {
          console.warn(`failed to decode`, params.redirect);
          errorService.setError('redirect-parameter', new Error(params.redirect));
          this.router.navigate(['/error']);
        }
      }
    });
  }

  async login() {
    const user = await this.authService.login(this.user);

    log.debug('Successfully logged in', user);

    if (user) {
      if (this.redirect) {
        return this.authService.redirectForOIDCProvider(this.redirect);
      }
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
