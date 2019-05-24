import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

import * as log from 'loglevel';
import { serverURL } from './config';
import { switchNetworkError } from '@interceptors/network-error';
import { ErrorService } from '@services/error';
import { LocalStorageService } from './local-storage';
import { keys } from '@app/config';
import { parse } from 'qs';
import { redirectForOIDC, redirectForOIDCProvider } from '@services/util';

const LOGIN_REDIRECT_KEY = keys.LOGIN_REDIRECT;

@Injectable({ providedIn: 'root' })
export class AppConfigService {

  private _appConfig: {
    OIDCPProviderURL: string, useOpenIDConnect: boolean, hasSession: boolean,
    publicInfo: {
      logoURL: string,
      HTMLFrame: string
    },
    user: ApiUserDTOObject, useSMTP: boolean, webClientURL: string,
    TCU: {
      name: string,
      data: string
    },
    contact: string
  };
  bootOnLogin = false;

  constructor(
    private http: Http,
    private errorService: ErrorService,
    private store: LocalStorageService) {

    const params = parse(location.search.substring(1));
    log.debug(`Boot on ${location.href}`);

    if (this.bootOnLogin = location.pathname === '/login') {
      log.debug('Forwarded login parameters', params);
      if (params.origin && params.origin.startsWith('oidcp') && params.redirect) {
        try {
          const redirect = atob(params.redirect);
          store.set(LOGIN_REDIRECT_KEY, redirect);
        } catch {
          log.warn(`failed to decode`, params.redirect);
          errorService.setError('redirect-parameter', new Error(params.redirect));
        }
      }
    }
  }

  async load() {
    this._appConfig = null;

    log.debug(`Load on ${location.href}`);

    return this.http.get(`${serverURL}/app-config`, { withCredentials: true })
      .pipe(map((res: Response) => res.json()))
      .toPromise()
      .then(async (config: any) => {
        this._appConfig = config;
        const redirect = this.store.get(LOGIN_REDIRECT_KEY);
        if (!config.hasSession) {
          log.debug(`User has no session, clear localstorage`);
          if (this.bootOnLogin && redirect && config.useOpenIDConnect) {
            log.info(`Automatic use of OIDCP`);
            redirectForOIDC();
          }
        } else {
          log.debug('User has a session, checking for redirect request...');
          if (this.bootOnLogin && redirect) {
            redirectForOIDCProvider(this.store, config, redirect);
          }
        }
      })
      .catch((err: any) => {
        if (err.status === 0 || err.status > 499) {
          this.errorService.setError(switchNetworkError(err), err);
          return Promise.resolve();
        }

        log.error('Failed to get initial configuration', err);
        return Promise.reject();
      })
      ;
  }

  getStartupConfig() {
    return this._appConfig;
  }
}

const reboot: Subject<void> = new Subject();
@Injectable({ providedIn: 'root' })
export class BootService {

  constructor(private ngZone: NgZone) { }

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
