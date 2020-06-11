import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { serverURL } from '@services/config';
import { KeyService } from '@services/key';
import { BehaviorSubject, Observable } from 'rxjs';
import * as log from 'loglevel';

@Injectable()
export class ServerConfigService {

  private _lock = 0;
  private isDoingSomething$: BehaviorSubject<boolean>;

  private config$: BehaviorSubject<ApiServerConfig>;

  private defaultKeyId: string;
  private defaultKey$: BehaviorSubject<ApiKeyObject>;

  private defaultKeyOwner$: BehaviorSubject<ApiUserObject>;

  constructor(
    private http: HttpClient,
    private keyService: KeyService
  ) {
    this.isDoingSomething$ = new BehaviorSubject(false);
    this.defaultKey$ = new BehaviorSubject(null);
    this.defaultKeyOwner$ = new BehaviorSubject(null);
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
        })
        .catch(() => {
          this.defaultKeyOwner$.next(null);
        })
        .then(() => this.decrLock());
    }
  }

  private incrLock() {
    this.isDoingSomething$.next(++this._lock !== 0);
  }

  private decrLock() {
    this.isDoingSomething$.next(--this._lock !== 0);
  }

  /**
   * Get a observable singleton on the server configuration.
   * Automatically trigger the loading of the server configuration at first get.
   */
  getConfig(): Observable<ApiServerConfig> {

    // Initialize the singleton used to observe the server configuration
    if (!this.config$) {

      this.config$ = new BehaviorSubject(null);

      this.config$.subscribe((config) => {
        if (config) {
          this.setDefaultKey(config.defaultKeyId);
          this.setDefaultKeyOwner(config.defaultKeyId);
        }
      });

      this.http.get<ApiServerConfig>(`${serverURL}/server-config`)
        .subscribe((config) => {
          log.debug('Configuration service initialized');
          this.config$.next(config);
        });
    }
    return this.config$;
  }

  updateConfig(config: ApiServerConfigUpdate): void {
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

  updateTCU(TCU: File) {
    const formData = new FormData();
    formData.append('file', TCU);
    this.http.post(`${serverURL}/server-config/TCU`, formData, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(events => {
        if (events.type === HttpEventType.UploadProgress) {
          log.debug('Upload progress: ', Math.round(events.loaded / events.total * 100) + '%');
        } else if (events.type === HttpEventType.Response) {
          log.debug(events);
        }
      });
  }

  defaultTCU() {
    this.http.get(`${serverURL}/server-config/TCU/default`)
      .subscribe(res => {
        log.debug(res);
      });
  }

  getTCU() {
    this.http.get(`${serverURL}/assets/custom_TCU.pdf`, { responseType: 'arraybuffer' })
      .subscribe(res => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const blobURL = window.URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobURL;
        tempLink.setAttribute('download', 'TCU.pdf');
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank');
        }
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      }, error => {
        log.error('File download error', JSON.stringify(error));
      }, () => {
        log.info('File download completed');
      });
  }
}
