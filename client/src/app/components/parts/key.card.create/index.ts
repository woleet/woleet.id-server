import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { KeyService } from '@services/key';
import { ErrorMessageProvider, nextYear } from '@components/util';
import { UserService } from '@services/user';
import { ServerConfigService } from '@services/server-config';
import * as timestring from 'timestring';
import * as log from 'loglevel';

@Component({
  selector: 'key-card-create',
  templateUrl: './index.html'
})
export class KeyCreateCardComponent extends ErrorMessageProvider {

  formLocked = false;

  @Input()
  userId: string;

  @Output()
  reset = new EventEmitter;

  @Output()
  create = new EventEmitter<ApiKeyObject>();

  keyName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);

  startDate = nextYear();

  expiration = new FormControl({value: '', disabled: true}, []);

  setAsDefault = false;

  constructor(private keyService: KeyService, private userService: UserService, configService: ServerConfigService) {
    super();
    configService.getConfig().subscribe((config) => {
      if (!config || !config.keyExpirationOffset) {
        return;
      }

      const now = +new Date;

      log.debug({ now, offset: config.keyExpirationOffset });

      this.expiration.setValue(new Date(timestring(config.keyExpirationOffset) * 1000 + now));
    });
  }

  async createKey() {
    this.formLocked = true;
    const name = this.keyName.value;
    const expiration = +this.expiration.value || undefined;

    const newKey = await this.keyService.create(this.userId, { name, expiration });

    if (this.setAsDefault) {
      await this.userService.update(this.userId, { defaultKeyId: newKey.id });
    }

    this.formLocked = false;
    this.keyName.reset();
    this.reset.emit();
    this.create.emit(newKey);
  }

  cancelKey() {
    this.keyName.reset();
    this.reset.emit();
  }

}
