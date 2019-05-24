import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider, secureUrlValidator } from '@components/util';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'config-proofdesk',
  templateUrl: './index.html'
})
export class ConfigProofDeskComponent extends ErrorMessageProvider implements OnInit, OnDestroy {

  formLocked$: Observable<boolean>;

  config$: Observable<ApiServerConfig>;

  proofDeskAPIIsValid;

  form: FormGroup;

  private onDestroy: EventEmitter<void>;

  constructor(private configService: ConfigService, private http: HttpClient) {
    super();
    this.onDestroy = new EventEmitter();
  }

  ngOnInit() {
    this.form = new FormGroup({
      proofDeskAPIURL: new FormControl({ value: '', }, [secureUrlValidator, Validators.required]),
      proofDeskAPIToken: new FormControl({ value: '' }, [Validators.required])
    });

    const config$ = this.config$ = this.configService.getConfig();

    this.formLocked$ = this.configService.isDoingSomething();

    this.registerSubscription(config$.subscribe((config) => {
      if (!config) {
        return;
      }

      this.form.get('proofDeskAPIURL').setValue(config.proofDeskAPIURL || 'https://api.woleet.io/v1');
      this.form.get('proofDeskAPIToken').setValue(config.proofDeskAPIToken || '');
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
    const proofDeskAPIURL = this.form.get('proofDeskAPIURL').value || null;
    const proofDeskAPIToken = this.form.get('proofDeskAPIToken').value || null;
    this.configService.update({
      proofDeskAPIURL,
      proofDeskAPIToken
    });
    this.registerSubscription(this.config$.subscribe((config) => {
      if (!config) {
        return;
      }
      this.proofDeskAPIIsValid = config.proofDeskAPIIsValid;
    }));
  }
}
