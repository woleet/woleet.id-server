import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

import * as log from 'loglevel';
import { serverURL } from './config';
import { switchNetworkError } from '@interceptors/network-error';
import { ErrorService } from '@services/error';
import { LocalStorageService } from './local-storage';

@Injectable({ providedIn: 'root' })
export class AppConfigService {

  private _appConfig: {
    OIDCPProviderURL: string,
    enableOpenIDConnect: boolean,
    hasSession: boolean,
    logoURL: string,
    HTMLFrame: string
    user: ApiUserDTOObject,
    enableSMTP: boolean,
    webClientURL: string,
    contact: string,
    organizationName: string,
    askForResetInput: boolean
  };

  constructor(
    private errorService: ErrorService,
    private store: LocalStorageService) {
  }

  async loadConfig() {
    this._appConfig = null;

    log.debug(`Load on ${location.href}`);

    // Must use the native way to handle request because this call is done during
    // the application boot and is used by the authentication service
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${serverURL}/app-config`);
      xhr.withCredentials = true;
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          const config = JSON.parse(xhr.responseText);
          this._appConfig = config;
          resolve(this._appConfig);
        } else if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 0 || xhr.status > 499) {
            this.errorService.setError(switchNetworkError(xhr.response), xhr.response);
            resolve(xhr.response);
          }

          log.error('Cannot get initial configuration', xhr.response);
          reject();
        }
      });
      xhr.send(null);
    });
  }

  getConfig() {
    return this._appConfig;
  }
}

const reboot: Subject<void> = new Subject();

@Injectable({ providedIn: 'root' })
export class BootService {

  constructor(private ngZone: NgZone) {
  }

  public static getBootControl() {
    return reboot.asObservable();
  }

  public static start() {
    log.debug('Boot app');
    reboot.next();
  }

  public restart() {
    this.ngZone.runOutsideAngular(() => {
      log.debug('Reboot app');
      reboot.next();
    });
  }
}
