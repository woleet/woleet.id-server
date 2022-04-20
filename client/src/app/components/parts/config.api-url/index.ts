import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider, urlValidator } from '@components/util';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import * as log from 'loglevel';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'config-api-url',
  templateUrl: './index.html'
})
export class ConfigAPIUrlComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

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
      this.form.setValue(config.APIURL);
    });

    this.onDestroy.subscribe(() => subscription.unsubscribe());
  }

  ngOnDestroy() {
    this.onDestroy.emit();
  }

  async submit() {
    const APIURL = this.form.value;
    log.debug('Set API URL to', APIURL);
    this.configService.updateConfig({ APIURL });
  }

  cancelEdit() {
    this.editMode = false;
  }

  beginEdit() {
    this.editMode = true;
    const guessClientURL = `${window.location.origin}` + environment.serverURL;
    if (this.form.value === undefined) {
      this.form.setValue(guessClientURL);
    }
  }
}
