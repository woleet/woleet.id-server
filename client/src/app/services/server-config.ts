import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from '@services/config';
import { Observable, BehaviorSubject } from 'rxjs';
import * as log from 'loglevel';



@Injectable()
export class ServerConfigService {

  private config: BehaviorSubject<ApiServerConfig> = null;
  private isConfigSet = false;

  constructor(private http: HttpClient) {
    this.config = new BehaviorSubject(null);
    this.config.subscribe((e) => {
      log.debug('SUSCRIBED', e);
    });
  }

  getConfig(): Observable<ApiServerConfig> {

    log.debug('getConfig');

    if (!this.isConfigSet) {
      log.debug('getConfig fisrt time');
      const config$ = this.http.get<ApiServerConfig>(`${serverURL}/server-config`);
      config$.subscribe((up) => {
        log.debug('updated', up);
        this.config.next(up);
      });
      this.isConfigSet = true;
    }

    log.debug('getConfig is set');

    return this.config.asObservable();
  }

  update(config: ApiServerConfigUpdate): void {
    const o$ = this.http.put<ApiServerConfig>(`${serverURL}/server-config`, config);
    o$.subscribe((up) => {
      log.debug('updated', up);
      this.config.next(up);
    });
  }

}
