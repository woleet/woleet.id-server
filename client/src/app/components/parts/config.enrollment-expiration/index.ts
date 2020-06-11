import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider, timeStringValidator } from '@components/util';
import { Observable } from 'rxjs';
import * as log from 'loglevel';
import * as timestring from 'timestring';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'config-enrollment-expiration',
  templateUrl: './index.html'
})
export class ConfigEnrollmentExpirationComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

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
      this.form.setValue(config.enrollmentExpirationOffset);
    });

    this.onDestroy.subscribe(() => subscription.unsubscribe());
  }

  ngOnDestroy() {
    this.onDestroy.emit();
  }

  async submit() {
    const enrollmentExpirationOffset = this.form.value || null;
    enrollmentExpirationOffset ?
      log.debug('Set default key expiration to', enrollmentExpirationOffset, timestring(enrollmentExpirationOffset))
      : log.debug('Unset default key expiration');
    this.configService.updateConfig({ enrollmentExpirationOffset });
  }

  cancelEdit() {
    this.editMode = false;
  }

  getSeconds(str) {
    return timestring(str);
  }
}
