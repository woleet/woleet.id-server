import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider, timeStringValidator } from '@components/util';
import { Observable } from 'rxjs';
import * as log from 'loglevel';
import * as timestring from 'timestring';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'config-key-expiration',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class ConfigKeyExpirationComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

  editMode = false;

  formLocked$: Observable<boolean>;

  config$: Observable<ApiServerConfig>;

  form: FormControl;

  private onDestroy: EventEmitter<void>;

  constructor(private configService: ConfigService) {
    super();
    this.onDestroy = new EventEmitter();
  }

  ngOnInit() {
    this.form = new FormControl('', [timeStringValidator]);

    const config$ = this.config$ = this.configService.getConfig();

    this.formLocked$ = this.configService.isDoingSomething();

    const subscription = config$.subscribe((config) => {
      if (!config) {
        return;
      }

      this.editMode = false;
      this.form.setValue(config.keyExpirationOffset);
    });

    this.onDestroy.subscribe(() => log.debug('Unsuscribe', subscription.unsubscribe()));
  }

  ngOnDestroy() {
    log.debug('unsubscribing');
    this.onDestroy.emit();
  }

  async submit() {
    const keyExpirationOffset = this.form.value || null;
    keyExpirationOffset ?
      log.debug('Set default key expiration to', keyExpirationOffset, timestring(keyExpirationOffset))
      : log.debug('Unset default key expiration.');
    this.configService.update({ keyExpirationOffset });
  }

  cancelEdit() {
    this.editMode = false;
  }

  getSeconds(str) {
    return timestring(str);
  }

}
