import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider, secureUrlValidator } from '@components/util';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { FormControl, Validators, FormGroup } from '@angular/forms';

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

  oidcpClients: ApiOIDCPClient[];

  private onDestroy: EventEmitter<void>;

  constructor(private configService: ConfigService) {
    super();
    this.onDestroy = new EventEmitter();
  }

  ngOnInit() {
    this.form = new FormGroup({
      issuerURL: new FormControl({ value: '', }, [secureUrlValidator]),
      interfaceURL: new FormControl({ value: '' }, [secureUrlValidator])
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

      const url = `${window.location.origin}`;

      this.enableOIDCP$.next(config.enableOIDCP);

      this.form.get('issuerURL').setValue(config.OIDCPIssuerURL || '');
      this.form.get('interfaceURL').setValue(config.OIDCPInterfaceURL || url);

      this.oidcpClients = config.OIDCPClients || []; // TODO: COPY

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
    const OIDCPIssuerURL = this.form.get('issuerURL').value || null;
    const OIDCPInterfaceURL = this.form.get('interfaceURL').value || null;
    const OIDCPClients = this.oidcpClients;
    const enableOIDCP = this._enableOIDCP;
    this.configService.update({
      enableOIDCP,
      OIDCPIssuerURL,
      OIDCPInterfaceURL,
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
    return this.form.valid && Object.values(this.form.value).every(e => !!e);
  }

  change() {
    this.changed = true;
    this.formValid$.next(this.isFormValid());
  }

  addClient() {
    this.oidcpClients.push({
      client_id: 'client-' + Math.random().toString(16).slice(-4),
      client_secret: 'secret-' + Math.random().toString(16).slice(-8),
      redirect_uris: ['']
    });
    this.change();
  }

  deleteClient(index) {
    this.oidcpClients.splice(index, 1);
    this.change();
  }

}
