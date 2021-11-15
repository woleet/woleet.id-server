import * as log from 'loglevel';
import { Component } from '@angular/core';
import { AuthService } from '@services/auth';
import { mainRoute } from '@app/config';
import { Router } from '@angular/router';
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
  config: any;

  constructor(private authService: AuthService, appConfigService: AppConfigService, private router: Router) {
    this.user = { username: '', password: '' };
    this.lock$ = authService.lock$;
    this.config = appConfigService.getConfig();

  }

  async login() {
    let user;
    user = await this.authService.login(this.user);
    log.debug('Successfully logged in', user);
    if (user) {
      if (user.role === 'admin' || user.role === 'manager') {
        this.router.navigate(['users']);
      } else {
        this.router.navigate([mainRoute]);
      }
    } else {
      this.errorMsg = 'Unable to login';
    }
  }

  openid() {
    return this.authService.openid();
  }
}
