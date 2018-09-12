import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerConfigService } from '@services/server-config';
import { KeyService } from '@services/key';
import { UserService } from '@services/user';
import * as log from 'loglevel';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-server-settings',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class ServerSettingsComponent implements OnInit, OnDestroy {
  loaded = false;
  editMode = false;
  formLocked = false;

  private sub: Subscription;
  config$: Observable<ApiServerConfig>;
  defaultKey$: Promise<ApiKeyObject>;
  defaultKeyOwner$: Promise<ApiUserObject>;

  userList$: Promise<ApiUserObject[]>;

  keyList$: Promise<ApiKeyObject[]>;
  keyListLoading = false;

  newKeyId = null;

  constructor(
    private configService: ServerConfigService,
    private userService: UserService,
    private keyService: KeyService,
  ) { }

  async ngOnInit() {
    const config$ = this.config$ = this.configService.getConfig();
    this.sub = config$.subscribe((config) => {
      log.debug('CONFIG', config);
      this.loaded = false;

      if (!config) {
        return;
      }

      if (config.defaultKeyId) {
        this.defaultKey$ = this.keyService.getById(config.defaultKeyId);
        this.defaultKeyOwner$ = this.keyService.getOwner(config.defaultKeyId);
        Promise.all([this.defaultKey$, this.defaultKeyOwner$]).then(() => this.loaded = true);
      } else {
        this.defaultKey$ = null;
        this.defaultKeyOwner$ = null;
      }

      this.newKeyId = null;
      this.editMode = false;
      this.formLocked = false;
    });
  }

  ngOnDestroy() {
    log.debug('unsubscribing');
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  async submit() {
    this.formLocked = true;
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
    this.formLocked = true;
    log.debug('Set fallback option to', fallbackOnDefaultKey);
    this.configService.update({ fallbackOnDefaultKey });
  }

  cancelEdit() {
    this.editMode = false;
  }

}
