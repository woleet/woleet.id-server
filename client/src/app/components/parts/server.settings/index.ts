import { Component, OnInit } from '@angular/core';
import { ServerConfigService } from '@services/server-config';
import { KeyService } from '@services/key';
import { UserService } from '@services/user';
import * as log from 'loglevel';

@Component({
  selector: 'app-server-settings',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class ServerSettingsComponent implements OnInit {

  loaded = false;
  editMode = false;
  formLocked = false;

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
    const config = await this.configService.getConfig();
    await this.loadConfig(config);
  }

  private async loadConfig(config) {
    this.loaded = false;
    if (config.defaultKeyId) {
      this.defaultKey$ = this.keyService.getById(config.defaultKeyId);
      this.defaultKeyOwner$ = this.keyService.getOwner(config.defaultKeyId);
      Promise.all([this.defaultKey$, this.defaultKeyOwner$]).then(() => this.loaded = true);
    } else {
      this.defaultKey$ = null;
      this.defaultKeyOwner$ = null;
    }
  }

  async submit() {
    this.formLocked = true;
    log.debug('Set new default server key to', this.newKeyId);
    const config = await this.configService.update({ defaultKeyId: this.newKeyId });

    await this.loadConfig(config);

    this.newKeyId = null;
    this.editMode = false;
    this.formLocked = false;
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

  cancelEdit() {
    this.editMode = false;
  }

}
