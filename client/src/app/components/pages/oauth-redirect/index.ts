import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth';
import { mainRoute } from '@app/config';

import * as log from 'loglevel';
import { ErrorService } from '@services/error';

@Component({
  templateUrl: './index.html'
})
export class OAuthRedirectComponent {

  errorMsg: string = null;

  constructor(activatedRoute: ActivatedRoute, authService: AuthService, router: Router, errorService: ErrorService) {
    console.log('PRX', authService.isAuthenticated());
    activatedRoute.queryParams.subscribe(async (params) => {
      console.log('params', params);

      try {
        const user = await authService.forwardOAuth(params);
        log.debug('Successfully logged in', user);

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
        console.error(err);
        this.errorMsg = `Failed to login: ${err.error.message}`;
      }

    });
  }

}
