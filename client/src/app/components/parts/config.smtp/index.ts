import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider } from '@components/util';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'config-stmp',
  templateUrl: './index.html'
})
export class ConfigSMTPComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

  formLocked$: Observable<boolean>;
  formValid$: BehaviorSubject<boolean>;
  enableSMTP$: BehaviorSubject<boolean>;

  config$: Observable<ApiServerConfig>;

  formSMTP: FormGroup;
  enableSMTP: boolean;
  changed = false;

  private onDestroy: EventEmitter<void>;

  constructor(private configService: ConfigService) {
    super();
    this.onDestroy = new EventEmitter();
  }

  ngOnInit() {
    this.formSMTP = new FormGroup({
      SMTPConfig: new FormControl({ value: '' }, [])
    });
    const config$ = this.config$ = this.configService.getConfig();

    this.formLocked$ = this.configService.isDoingSomething();
    this.enableSMTP$ = new BehaviorSubject(true);
    this.formValid$ = new BehaviorSubject(false);

    this.registerSubscription(config$.subscribe((config) => {
      if (!config) {
        return;
      }

      this.enableSMTP$.next(config.enableSMTP);

      this.formSMTP.get('SMTPConfig').setValue(config.SMTPConfig || '');

      this.changed = false;
      this.formValid$.next(this.isFormValid());
    }));

    this.registerSubscription(this.formLocked$.subscribe((locked) => {
      if (locked) {
        this.formSMTP.disable();
      } else {
        this.formSMTP.enable();
      }
    }));
  }

  registerSubscription(sub: Subscription) {
    this.onDestroy.subscribe(() => sub.unsubscribe());
  }

  ngOnDestroy() {
    this.onDestroy.emit();
  }

  update() {
    const enableSMTP = this.enableSMTP;

    const SMTPConfig = this.formSMTP.get('SMTPConfig').value || null;
    this.configService.updateConfig({ enableSMTP, SMTPConfig });
  }

  updateSMTPOption(enableSMTP) {
    this.enableSMTP = enableSMTP;
    this.enableSMTP$.next(enableSMTP);
    this.formValid$.next(this.isFormValid());
    this.changed = true;
  }

  isFormValid() {
    return this.formSMTP.valid && Object.values(this.formSMTP.value).every(e => !!e);
  }

  change() {
    this.changed = true;
    this.formValid$.next(this.isFormValid());
  }
}
