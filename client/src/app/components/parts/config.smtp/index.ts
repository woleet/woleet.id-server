import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider, secureUrlValidator } from '@components/util';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'config-stmp',
  templateUrl: './index.html'
})
export class ConfigSMTPComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

  formLocked$: Observable<boolean>;
  formValid$: BehaviorSubject<boolean>;
  useSMTP$: BehaviorSubject<boolean>;

  config$: Observable<ApiServerConfig>;

  form: FormGroup;
  _useSMTP: boolean;
  reveal = false;
  changed = false;

  private onDestroy: EventEmitter<void>;

  constructor(private configService: ConfigService) {
    super();
    this.onDestroy = new EventEmitter();
  }

  ngOnInit() {
    this.form = new FormGroup({
      SMTPConfig: new FormControl({ value: '' }, []),
    });
    const config$ = this.config$ = this.configService.getConfig();

    this.formLocked$ = this.configService.isDoingSomething();
    this.useSMTP$ = new BehaviorSubject(true);
    this.formValid$ = new BehaviorSubject(false);

    this.registerSubscription(config$.subscribe((config) => {
      if (!config) {
        return;
      }

      this.useSMTP$.next(config.useSMTP);

      this.form.get('SMTPConfig').setValue(config.SMTPConfig || '');

      this.changed = false;
      this.formValid$.next(this.isFormValid());
    }));

    this.registerSubscription(this.formLocked$.subscribe((locked) => {
      if (locked) {
        this.form.disable();
      } else {
        this.form.enable();
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
    const useSMTP = this._useSMTP;

    const SMTPConfig = this.form.get('SMTPConfig').value || null;
    this.configService.update({
      useSMTP,
      SMTPConfig,
    });
  }

  updateSMTPOption(useSMTP) {
    this._useSMTP = useSMTP;
    this.useSMTP$.next(useSMTP);
    this.formValid$.next(this.isFormValid());
    this.changed = true;
  }

  isFormValid() {
    return this.form.valid && Object.values(this.form.value).every(e => !!e);
  }

  change() {
    this.changed = true;
    this.formValid$.next(this.isFormValid());
  }

}
