import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Device, ExternalKeyService } from '@services/key';
import { addressValidator, ErrorMessageProvider, nextYear } from '@components/util';

@Component({
  selector: 'key-card-create-extern',
  templateUrl: './index.html'
})
export class KeyCreateCardExternComponent extends ErrorMessageProvider {

  formLocked = false;
  errorMsgs: any[];
  deviceSelected: KeyDeviceEnum | null;

  @Input()
  userId: string;

  @Output()
  reset = new EventEmitter;

  @Output()
  create = new EventEmitter<ApiKeyObject>();

  keyName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);

  startDate = nextYear();

  publicKey = new FormControl('', [Validators.required, Validators.minLength(26), Validators.maxLength(35), addressValidator]);

  expiration = new FormControl('', []);

  devices: Device[] = [
    { value: null, viewValue: 'Any' },
    { value: 'nano', viewValue: 'Ledger Nano S' },
    { value: 'mobile', viewValue: 'Mobile Device' }
  ];

  constructor(private keyService: ExternalKeyService) {
    super();
  }

  async createKey() {
    this.formLocked = true;
    const name = this.keyName.value;
    const publicKey = this.publicKey.value;
    const expiration = +this.expiration.value || undefined;
    const device = this.deviceSelected;
    let newKey;

    try {
      newKey = await this.keyService.create(this.userId, { name, publicKey, expiration, device });
      this.formLocked = false;
      this.keyName.reset();
      this.reset.emit();
      this.create.emit(newKey);
    } catch (error) {
      this.formLocked = false;
      this.errorMsgs = error.error.message.errors;
    }
  }

  cancelKey() {
    this.keyName.reset();
    this.reset.emit();
  }
}
