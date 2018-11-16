import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

import * as log from 'loglevel';
import { serverURL } from './config';
import { HttpErrorResponse } from '@angular/common/http';
import { switchNetworkError } from '@interceptors/network-error';
import { ErrorService } from '@services/error';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AppConfigService {

  private _appConfig: { OIDCPProviderURL: string, useOpenIDConnect: boolean, hasSession: boolean };

  constructor(private http: Http, private errorService: ErrorService) { }

  async load() {

    this._appConfig = null;

    return this.http.get(`${serverURL}/app-config`, { withCredentials: true })
      .pipe(map((res: Response) => res.json()))
      .toPromise()
      .then((data: any) => {
        this._appConfig = data;
        if (!data.hasSession) {
          localStorage.removeItem('user');
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
