import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

import * as log from 'loglevel';
import { serverURL } from './config';

@Injectable({ providedIn: 'root' })
export class AppConfigService {

  private _appConfig: { openIDConnectURL: string, useOpenIDConnect: boolean };

  constructor(private http: Http) { }

  async load() {

    this._appConfig = null;

    return this.http.get(`${serverURL}/app-config`)
      .pipe(map((res: Response) => res.json()))
      .toPromise()
      .then((data: any) => this._appConfig = data)
      .catch((err: any) => Promise.resolve())
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
