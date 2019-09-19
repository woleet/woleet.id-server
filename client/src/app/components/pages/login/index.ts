import * as log from 'loglevel';
import { Component } from '@angular/core';
import { AuthService } from '@services/auth';
import { mainRoute } from '@app/config';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfigService } from '@services/boot';
import { LocalStorageService } from '@services/local-storage';
import { ErrorService } from '@services/error';
import { redirectForOIDCProvider } from '@services/util';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class LoginPageComponent {
  user: BasicAuthObject;
  lock$: Observable<boolean>;

  errorMsg: string = null;
  redirect: string;
  config: any;

  constructor(private authService: AuthService,
              private router: Router,
              activatedRoute: ActivatedRoute,
              private store: LocalStorageService,
              errorService: ErrorService,
              appConfigService: AppConfigService) {
    this.user = { username: '', password: '' };
    this.lock$ = authService.lock$;
    activatedRoute.queryParams.subscribe(async (params) => {
      log.debug('Forwarded login parameters', params);
      if (params.origin && params.origin.startsWith('oidcp') && params.redirect) {
        try {
          this.redirect = atob(params.redirect);
        } catch {
          log.warn(`Failed to decode`, params.redirect);
          errorService.setError('redirect-parameter', new Error(params.redirect));
          this.router.navigate(['/error']);
        }
      }
    });
    this.config = appConfigService.getConfig();
  }

  async login() {
    const user = await this.authService.login(this.user);
    log.debug('Successfully logged in', user);
    if (user) {
      if (this.redirect) {
        redirectForOIDCProvider(this.store, this.config, this.redirect);
      } else {
        if (user.role === 'admin' || user.role === 'manager') {
          this.router.navigate(['users']);
        } else {
          this.router.navigate([mainRoute]);
        }
      }
    } else {
      this.errorMsg = 'Failed to login.';
    }
  }

  openid() {
    return this.authService.openid();
  }
}
