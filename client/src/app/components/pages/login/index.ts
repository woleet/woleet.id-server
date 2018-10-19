import { Component } from '@angular/core';
import { AuthService } from '@services/auth';
import { Router } from '@angular/router';
import { mainRoute } from '@app/config';

import * as log from 'loglevel';
import { Observable } from 'rxjs';
import { AppConfigService } from '@services/boot';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class LoginPageComponent {

  user: BasicAuthObject;
  lock$: Observable<boolean>;

  errorMsg: string = null;
  useOIDC: boolean;

  constructor(private authService: AuthService, private router: Router, appConfigService: AppConfigService) {
    this.user = { username: '', password: '' };
    this.lock$ = authService.lock$;
    this.useOIDC = appConfigService.getStartupConfig().useOpenIDConnect;
  }

  async login() {
    const user = await this.authService.login(this.user);

    log.debug('Successfully logged in', user);

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
