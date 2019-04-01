import { Component } from '@angular/core';
import { AuthService } from '@services/auth';
import { mainRoute } from '@app/config';
import { Router, ActivatedRoute } from '@angular/router';

import * as log from 'loglevel';
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
  useOIDC: boolean;
  serverPublicInfo: ApiServerConfig['publicInfo'];
  useSMTP: boolean;
  redirect: string;
  config: { OIDCPProviderURL: string; useOpenIDConnect: boolean; hasSession: boolean; publicInfo: object};

  constructor(
    private authService: AuthService,
    private router: Router,
    activatedRoute: ActivatedRoute,
    private store: LocalStorageService,
    errorService: ErrorService,
    appConfigService: AppConfigService) {
    this.user = { username: '', password: '' };
    this.lock$ = authService.lock$;
    this.config = appConfigService.getStartupConfig();
    this.useOIDC = this.config.useOpenIDConnect;
    this.serverPublicInfo = this.config.publicInfo || null;
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
    const config = appConfigService.getStartupConfig();
    this.useOIDC = config && config.useOpenIDConnect;
    this.serverPublicInfo = config.publicInfo || null;
    this.useSMTP = config && config.useSMTP;
  }

  async login() {
    const user = await this.authService.login(this.user);
    log.debug('Successfully logged in', user);
    if (user) {
      if (this.redirect) {
        redirectForOIDCProvider(this.store, this.config, this.redirect);
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
