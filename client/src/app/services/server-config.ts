import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from '@services/config';
import { KeyService } from '@services/key';
import { BehaviorSubject, Observable } from 'rxjs';
import * as log from 'loglevel';

@Injectable()
export class ServerConfigService {

  private _lock = 0;
  private _lastChecked = 0;
  private isDoingSomething$: BehaviorSubject<boolean>;

  private config$: BehaviorSubject<ApiServerConfig> = null;
  private isConfigInit = false;

  private defaultKeyId: string;
  private defaultKey$: BehaviorSubject<ApiKeyObject>;

  private defaultKeyOwnerId: string;
  private defaultKeyOwner$: BehaviorSubject<ApiUserObject>;

  constructor(
    private http: HttpClient,
    private keyService: KeyService
  ) {
    this.config$ = new BehaviorSubject(null);
    this.config$.subscribe((cfg) => {
      if (cfg) {
        this.setDefaultKey(cfg.defaultKeyId);
        this.setDefaultKeyOwner(cfg.defaultKeyId);
      }
    });

    this.isDoingSomething$ = new BehaviorSubject(false);
    this.defaultKey$ = new BehaviorSubject(null);
    this.defaultKeyOwner$ = new BehaviorSubject(null);
  }

  // Make an http call to initialize the config$ attribut
  loadConfig() {
    this.http.get<ApiServerConfig>(`${serverURL}/server-config`)
      .subscribe((up) => {
        log.debug('initialised', up);
        this.config$.next(up);
      });
    this.isConfigInit = true;
  }

  // Get the server-config stocked as an attribute (as a observable in config$) or get it from the server the first time.
  getConfig(): Observable<ApiServerConfig> {
    if (!this.isConfigInit) {
      this.loadConfig();
    }
    return this.config$.asObservable();
  }

  private setDefaultKey(defaultKeyId) {
    if (defaultKeyId !== this.defaultKeyId) {

      if (defaultKeyId === null) {
        this.defaultKey$.next(null);
        this.defaultKeyId = null;
        return;
      }

      this.incrLock();
      this.keyService.getById(defaultKeyId)
        .then((key) => {
          this.defaultKey$.next(key);
          this.defaultKeyId = key.id;
        })
        .catch(() => {
          this.defaultKey$.next(null);
          this.defaultKeyId = null;
        })
        .then(() => this.decrLock());
    }
  }

  private setDefaultKeyOwner(defaultKeyId) {
    if (defaultKeyId !== this.defaultKeyId) {

      if (defaultKeyId === null) {
        this.defaultKey$.next(null);
        this.defaultKeyId = null;
        return;
      }

      this.incrLock();
      this.keyService.getOwner(defaultKeyId)
        .then((user) => {
          this.defaultKeyOwner$.next(user);
          this.defaultKeyOwnerId = user.id;
        })
        .catch(() => {
          this.defaultKeyOwner$.next(null);
          this.defaultKeyOwnerId = null;
        })
        .then(() => this.decrLock());
    }
  }

  update(config: ApiServerConfigUpdate): void {
    this.incrLock();
    this.http.put<ApiServerConfig>(`${serverURL}/server-config`, config)
      .subscribe((up) => {
        this.decrLock();
        log.debug('updated', up);
        this.config$.next(up);
      });
  }

  isDoingSomething(): Observable<boolean> {
    return this.isDoingSomething$.asObservable();
  }

  getDefaultKey(): Observable<ApiKeyObject> {
    return this.defaultKey$.asObservable();
  }

  getDefaultKeyOwner(): Observable<ApiUserObject> {
    return this.defaultKeyOwner$.asObservable();
  }

  private incrLock() {
    this.isDoingSomething$.next(++this._lock !== 0);
  }

  private decrLock() {
    this.isDoingSomething$.next(--this._lock !== 0);
  }
}
