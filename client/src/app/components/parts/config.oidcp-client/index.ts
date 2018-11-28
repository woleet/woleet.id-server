import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ErrorMessageProvider, secureUrlValidator } from '@components/util';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'config-oidcp-client',
  templateUrl: './index.html'
})
export class ConfigOIDCPClientComponent extends ErrorMessageProvider implements OnInit {

  @Input()
  client: ApiOIDCPClient & { _valid: () => boolean };

  @Output()
  delete = new EventEmitter;

  @Output()
  change = new EventEmitter;

  clientForm: FormGroup;

  ngOnInit() {
    this.clientForm = new FormGroup({
      clientId: new FormControl(this.client.client_id, [Validators.minLength(1)]),
      clientSecret: new FormControl(this.client.client_secret, [Validators.minLength(1)]),
      redirectUris: new FormArray(
        this.client.redirect_uris.map((value = '') => new FormControl(value, [secureUrlValidator]))
      )
    });
    Object.defineProperty(this.client, '_valid', { enumerable: false, value: () => this.clientForm.valid });
  }

  addRedirectUri() {
    this.client.redirect_uris.push('');
    (<FormArray>this.clientForm.get('redirectUris')).push(new FormControl('', [secureUrlValidator]));
    this.refreshTargetValue();
  }

  deleteRedirectUri(index) {
    const array: FormArray = (<FormArray>this.clientForm.get('redirectUris'));
    if (index === 0 && array.length === 1) {
      array.controls[0].reset();
    } else {
      array.removeAt(index);
    }
    this.refreshTargetValue();
  }

  refreshTargetValue() {
    const controls = (<FormArray>this.clientForm.get('redirectUris')).controls;
    const up = this.clientForm.value;
    Object.assign(this.client, <ApiOIDCPClient>{
      client_id: up.clientId,
      client_secret: up.clientSecret,
      redirect_uris: up.redirectUris
    });
    console.log({ up, controls });
    this.change.emit();
  }

  deleteClient() {
    this.delete.emit();
  }

}
