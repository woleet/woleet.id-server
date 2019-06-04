import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth';

import * as log from 'loglevel';

@Component({ templateUrl: './index.html' })
export class OIDCProviderInteractionComponent {

  errorMsg: string = null;

  constructor(activatedRoute: ActivatedRoute, authService: AuthService, router: Router) {
    activatedRoute.queryParams.subscribe(async (params) => {
      log.debug('Forward oauth parameters', params);
    });
  }
}
