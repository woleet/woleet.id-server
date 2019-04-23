import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ExternalKeyService } from '@services/key';
import { ErrorMessageProvider, nextYear } from '@components/util';
import { addressValidator } from '@components/util';

@Component({
  selector: 'key-card-create-extern',
  templateUrl: './index.html'
})
export class KeyCreateCardExternComponent extends ErrorMessageProvider {

  formLocked = false;
  errorMsgs: any[];

  @Input()
  userId: string;

  @Output()
  reset = new EventEmitter;

  @Output()
  create = new EventEmitter<ApiKeyObject>();

  keyName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);

  startDate = nextYear();

  publicKey = new FormControl('', [Validators.required, Validators.minLength(26), Validators.maxLength(35), addressValidator]);

  expiration = new FormControl(null, []);

  setAsDefault = false;

  constructor(private keyService: ExternalKeyService) {
    super();
  }

  async createKey() {
    this.formLocked = true;
    const name = this.keyName.value;
    const publicKey = this.publicKey.value;
    let newKey;

    try {
      newKey = await this.keyService.create(this.userId, { name, publicKey });
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
