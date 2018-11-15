import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ErrorMessageProvider, secureUrlValidator } from '@components/util';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'config-oidcp-client',
  templateUrl: './index.html'
})
export class ConfigOIDCPClientComponent extends ErrorMessageProvider implements OnInit {

  @Input()
  client: ApiOIDCPClient;

  @Output()
  delete = new EventEmitter;

  clientForm: FormGroup;

  ngOnInit() {
    this.clientForm = new FormGroup({
      clientId: new FormControl(this.client.client_id, [Validators.minLength(1)]),
      clientSecret: new FormControl(this.client.client_secret, [Validators.minLength(1)]),
      redirectUris: new FormArray(
        this.client.redirect_uris.map((value = '') => new FormControl(value, [secureUrlValidator]))
      )
    });
  }

  addRedirectUri() {
    this.client.redirect_uris.push('');
    (<FormArray>this.clientForm.get('redirectUris')).push(new FormControl('', [secureUrlValidator]));
  }

  deleteRedirectUri(index) {
    const controls = (<FormArray>this.clientForm.get('redirectUris')).controls;
    if (index === 0 && controls.length === 1) {
      controls[0].reset();
    } else {
      controls.splice(index, 1);
    }
  }

  refreshTargetValue() {
    const up = this.clientForm.value;
    Object.assign(this.client, <ApiOIDCPClient>{
      client_id: up.clientId,
      client_secret: up.clientSecret,
      redirect_uris: up.redirectUris
    });
  }

  deleteClient() {
    this.delete.emit();
  }

}
