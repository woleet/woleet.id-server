import { Component, OnInit } from '@angular/core';
import { ServerConfigService } from '@services/server-config';
import { KeyService } from '@services/key';
import { UserService } from '@services/user';

@Component({
  selector: 'app-server-settings',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class ServerSettingsComponent implements OnInit {

  loaded = false;
  editMode = false;
  defaultKey$;
  defaultKeyOwner$;

  JSON = JSON;

  constructor(
    private configService: ServerConfigService,
    private userService: UserService,
    private keyService: KeyService,
  ) { }

  async ngOnInit() {
    const config = await this.configService.getConfig();

    this.loaded = true;

    if (config.defaultKeyId) {
      this.defaultKey$ = this.keyService.getById(config.defaultKeyId);
      this.defaultKeyOwner$ = this.keyService.getOwner(config.defaultKeyId);
    } else {
      this.defaultKey$ = null;
      this.defaultKeyOwner$ = null;
    }

  }

  submit() {

    this.editMode = false;
  }

  cancelEdit() {
    this.editMode = false;
  }

}
