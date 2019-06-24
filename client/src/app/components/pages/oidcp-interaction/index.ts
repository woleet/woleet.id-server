import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as log from 'loglevel';

@Component({ templateUrl: './index.html' })
export class OIDCProviderInteractionComponent {

  errorMsg: string = null;

  constructor(activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(async (params) => {
      log.debug('Forward oauth parameters', params);
    });
  }
}
