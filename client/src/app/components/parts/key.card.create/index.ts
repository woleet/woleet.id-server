import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { KeyService } from '@services/key';
import { ErrorMessageProvider } from '@components/util';
import { UserService } from '@services/user';

@Component({
  selector: 'key-card-create',
  templateUrl: './index.html'
})
export class KeyCreateCardComponent extends ErrorMessageProvider {

  @Input()
  userId: string;

  @Output()
  reset = new EventEmitter;

  @Output()
  create = new EventEmitter<ApiKeyObject>();

  keyName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);

  setAsDefault = false;

  constructor(private keyService: KeyService, private userService: UserService) {
    super();
  }

  async createKey() {
    const name = this.keyName.value;

    const newKey = await this.keyService.create(this.userId, { name });

    if (this.setAsDefault) {
      await this.userService.update(this.userId, { defaultKeyId: newKey.id });
    }

    this.keyName.reset();
    this.reset.emit();
    this.create.emit(newKey);
  }

  cancelKey() {
    this.keyName.reset();
    this.reset.emit();
  }

}
