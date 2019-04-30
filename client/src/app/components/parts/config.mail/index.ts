import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider } from '@components/util';
import { Observable } from 'rxjs';
import * as log from 'loglevel';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'config-mail-template',
  templateUrl: './index.html'
})
export class ConfigMailTemplateComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

  formLocked$: Observable<boolean>;

  config$: Observable<ApiServerConfig>;

  formMail: FormGroup;

  private onDestroy: EventEmitter<void>;

  constructor(private configService: ConfigService) {
    super();
    this.onDestroy = new EventEmitter();
  }

  ngOnInit() {
    this.formMail = new FormGroup({
      resetPasswordMail: new FormControl('', []),
      onboardingMail: new FormControl('', []),
      keyEnrolementMail: new FormControl('', []),
    });

    const config$ = this.config$ = this.configService.getConfig();
    this.formLocked$ = this.configService.isDoingSomething();

    const subscription = config$.subscribe((config) => {
      if (!config) {
        return;
      }

      this.formMail.get('resetPasswordMail').setValue(config.mailResetPasswordTemplate);
      this.formMail.get('onboardingMail').setValue(config.mailOnboardingTemplate);
      this.formMail.get('keyEnrolementMail').setValue(config.mailKeyEnrolmentTemplate);
    });

    this.onDestroy.subscribe(() => log.debug('Unsuscribe', subscription.unsubscribe()));
  }

  ngOnDestroy() {
    this.onDestroy.emit();
  }

  async submit() {
    const mailResetPasswordTemplate = this.formMail.get('resetPasswordMail').value;
    const mailOnboardingTemplate = this.formMail.get('onboardingMail').value;
    const mailKeyEnrolmentTemplate = this.formMail.get('keyEnrolementMail').value;
    this.configService.update({ mailResetPasswordTemplate, mailOnboardingTemplate, mailKeyEnrolmentTemplate });
  }
}
