import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider, urlValidator } from '@components/util';
import { Observable } from 'rxjs';
import * as log from 'loglevel';
import { FormControl } from '@angular/forms';
import { environment } from '@env/environment';

@Component({
  selector: 'config-signature-url',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class ConfigSignatureUrlComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

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
    this.form = new FormControl('', [urlValidator]);

    const config$ = this.config$ = this.configService.getConfig();

    this.formLocked$ = this.configService.isDoingSomething();

    const subscription = config$.subscribe((config) => {
      if (!config) {
        return;
      }

      this.editMode = false;
      this.form.setValue(config.signatureURL);
    });

    this.onDestroy.subscribe(() => subscription.unsubscribe());
  }

  ngOnDestroy() {
    this.onDestroy.emit();
  }

  async submit() {
    const signatureURL = this.form.value;
    log.debug('Set signature URL to', signatureURL);
    this.configService.updateConfig({ signatureURL });
  }

  beginEdit() {
    this.editMode = true;
    const guessSignatureURL = 'https://yourdomain.etc:3002';
    if (this.form.value === undefined) {
      this.form.setValue(guessSignatureURL);
    }
  }

  cancelEdit() {
    this.editMode = false;
  }
}
