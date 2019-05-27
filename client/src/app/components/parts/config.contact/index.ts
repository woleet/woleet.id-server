import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider } from '@components/util';
import { Observable } from 'rxjs';
import * as log from 'loglevel';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'config-contact',
  templateUrl: './index.html'
})
export class ConfigContactComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

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
    this.form = new FormControl('', [Validators.email]);

    const config$ = this.config$ = this.configService.getConfig();

    this.formLocked$ = this.configService.isDoingSomething();

    const subscription = config$.subscribe((config) => {
      if (!config) {
        return;
      }

      this.editMode = false;
      this.form.setValue(config.contact);
    });

    this.onDestroy.subscribe(() => log.debug('Unsuscribe', subscription.unsubscribe()));
  }

  ngOnDestroy() {
    this.onDestroy.emit();
  }

  async submit() {
    const contact = this.form.value;
    log.debug('Set contact to', contact);
    this.configService.update({ contact });
  }

  cancelEdit() {
    this.editMode = false;
  }
}
