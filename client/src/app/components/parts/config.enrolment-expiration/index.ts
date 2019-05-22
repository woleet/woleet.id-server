import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider, timeStringValidator } from '@components/util';
import { Observable } from 'rxjs';
import * as log from 'loglevel';
import * as timestring from 'timestring';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'config-enrolment-expiration',
  templateUrl: './index.html'
})
export class ConfigEnrolmentExpirationComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

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
      this.form.setValue(config.enrolmentExpirationOffset);
    });

    this.onDestroy.subscribe(() => log.debug('Unsubscribe', subscription.unsubscribe()));
  }

  ngOnDestroy() {
    this.onDestroy.emit();
  }

  async submit() {
    const enrolmentExpirationOffset = this.form.value || null;
    enrolmentExpirationOffset ?
      log.debug('Set default key expiration to', enrolmentExpirationOffset, timestring(enrolmentExpirationOffset))
      : log.debug('Unset default key expiration.');
    this.configService.update({ enrolmentExpirationOffset });
  }

  cancelEdit() {
    this.editMode = false;
  }

  getSeconds(str) {
    return timestring(str);
  }

}
