import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider, secureUrlValidator } from '@components/util';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import copy from 'deep-copy';

@Component({
  selector: 'config-oidcp',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class ConfigOIDCPComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

  formLocked$: Observable<boolean>;
  formValid$: BehaviorSubject<boolean>;
  enableOIDCP$: BehaviorSubject<boolean>;
  config$: Observable<ApiServerConfig>;

  form: FormGroup;
  _enableOIDCP: boolean;
  reveal = false;
  changed = false;
  updated = false;

  oidcpClients: (ApiOIDCPClient & { _valid?: () => boolean })[];

  private onDestroy: EventEmitter<void>;

  constructor(private configService: ConfigService) {
    super();
    this.onDestroy = new EventEmitter();
  }

  ngOnInit() {
    this.form = new FormGroup({
      providerURL: new FormControl({ value: '' }, [secureUrlValidator])
    });

    this.oidcpClients = [];

    const config$ = this.config$ = this.configService.getConfig();

    this.formLocked$ = this.configService.isDoingSomething();
    this.enableOIDCP$ = new BehaviorSubject(true);
    this.formValid$ = new BehaviorSubject(false);

    this.registerSubscription(config$.subscribe((config) => {
      if (!config) {
        return;
      }

      const guessProvider = `https://${window.location.hostname}:3003`;

      this.enableOIDCP$.next(config.enableOIDCP);

      this.form.get('providerURL').setValue(config.OIDCPProviderURL || guessProvider);

      this.oidcpClients = copy(config.OIDCPClients || []);

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
    this.updated = true;
    const OIDCPProviderURL = this.form.get('providerURL').value || null;
    const OIDCPClients = this.oidcpClients;
    OIDCPClients.forEach((c) => c.redirect_uris = c.redirect_uris.filter(e => !!e));
    const enableOIDCP = this._enableOIDCP;
    this.configService.updateConfig({
      enableOIDCP,
      OIDCPProviderURL,
      OIDCPClients
    });
  }

  updateEnableOIDCPOption(enableOIDCP) {
    this._enableOIDCP = enableOIDCP;
    this.enableOIDCP$.next(enableOIDCP);
    this.formValid$.next(this.isFormValid());
    this.changed = true;
  }

  isFormValid() {
    return this.form.valid
      && this.oidcpClients.every((client) => client._valid && client._valid())
      && Object.values(this.form.value).every(e => !!e);
  }

  change() {
    this.changed = true;
    this.formValid$.next(this.isFormValid());
  }

  addClient() {
    this.oidcpClients.push({
      token_endpoint_auth_method: 'client_secret_basic',
      client_id: 'client-' + Math.random().toString(16).slice(-4),
      client_secret: 'secret-' + Math.random().toString(16).slice(-8),
      redirect_uris: [''],
      post_logout_redirect_uris: [''],
      _valid: null
    });
    this.change();
  }

  deleteClient(index) {
    this.oidcpClients.splice(index, 1);
    this.change();
  }
}
