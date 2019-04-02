import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { KeyService } from '@services/key';
import { UserService } from '@services/user';
import { Observable } from 'rxjs';
import * as log from 'loglevel';

@Component({
  selector: 'config-fallback-key',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class ConfigFallbackKeyComponent implements OnInit, OnDestroy {

  editMode = false;
  formLocked$: Observable<boolean>;
  config$: Observable<ApiServerConfig>;
  defaultKey$: Observable<ApiKeyObject>;
  defaultKeyOwner$: Observable<ApiUserObject>;

  userList$: Promise<ApiUserObject[]>;

  keyList$: Promise<ApiKeyObject[]>;
  keyListLoading = false;

  newKeyId = null;

  private onDestroy: EventEmitter<void>;

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private keyService: KeyService,
  ) {
    this.onDestroy = new EventEmitter();
  }

  async ngOnInit() {
    const config$ = this.config$ = this.configService.getConfig();

    this.defaultKey$ = this.configService.getDefaultKey();

    this.defaultKeyOwner$ = this.configService.getDefaultKeyOwner();

    this.formLocked$ = this.configService.isDoingSomething();

    const subscription = config$.subscribe((config) => {
      if (!config) {
        return;
      }

      this.newKeyId = null;
      this.editMode = false;
    });

    this.onDestroy.subscribe(() => log.debug('Unsuscribe', subscription.unsubscribe()));
  }

  ngOnDestroy() {
    this.onDestroy.emit();
  }

  async submit() {
    log.debug('Set new default server key to', this.newKeyId);
    this.configService.update({ defaultKeyId: this.newKeyId });
  }

  loadUserList() {
    if (!this.userList$) {
      this.userList$ = this.userService.getAll();
    }
  }

  loadUserKeys(evt) {
    log.debug('Selected user', evt.value);
    this.keyListLoading = true;
    this.keyList$ = this.keyService.getByUser(evt.value)
      .then((res) => {
        log.debug('Loaded key', res);
        this.keyListLoading = false;
        return res;
      });
  }

  async updateFallbackOnDefaultKeyOption(fallbackOnDefaultKey) {
    log.debug('Set fallback option to', fallbackOnDefaultKey);
    this.configService.update({ fallbackOnDefaultKey });
  }

  cancelEdit() {
    this.editMode = false;
  }

}
