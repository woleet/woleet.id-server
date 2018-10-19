import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider, secureUrlValidator } from '@components/util';
import { Observable, Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import * as log from 'loglevel';

@Component({
  selector: 'config-openid',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class ConfigOpenIDComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

  formLocked$: Observable<boolean>;

  config$: Observable<ApiServerConfig>;

  form: FormGroup;
  _useOpenIDConnect: boolean;
  reveal = false;
  changed = false;

  private onDestroy: EventEmitter<void>;

  constructor(private configService: ConfigService) {
    super();
    this.onDestroy = new EventEmitter();
  }

  ngOnInit() {
    this.form = new FormGroup({
      openIDConnectURL: new FormControl({ value: '', disabled: true }, [secureUrlValidator]),
      openIDConnectClientId: new FormControl({ value: '', disabled: true }, [Validators.minLength(1)]),
      openIDConnectClientSecret: new FormControl({ value: '', disabled: true }, [Validators.minLength(1)]),
    });

    const config$ = this.config$ = this.configService.getConfig();

    this.formLocked$ = this.configService.isDoingSomething();

    this.registerSubscription(config$.subscribe((config) => {
      if (!config) {
        return;
      }

      this.form.get('openIDConnectURL').setValue(config.openIDConnectURL || '');
      this.form.get('openIDConnectClientId').setValue(config.openIDConnectClientId || '');
      this.form.get('openIDConnectClientSecret').setValue(config.openIDConnectClientSecret || '');
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

  async update() {
    const openIDConnectURL = this.form.get('openIDConnectURL').value || null;
    const openIDConnectClientId = this.form.get('openIDConnectClientId').value || null;
    const openIDConnectClientSecret = this.form.get('openIDConnectClientSecret').value || null;
    const useOpenIDConnect = this._useOpenIDConnect;
    this.configService.update({
      openIDConnectURL,
      useOpenIDConnect,
      openIDConnectClientId,
      openIDConnectClientSecret
    });
  }

  updateUseOpenIDConnectOption(useOpenIDConnect) {
    this._useOpenIDConnect = useOpenIDConnect;
    this.changed = true;
  }

  openIDConnectURLChanged() {
    this.changed = true;
  }

}
