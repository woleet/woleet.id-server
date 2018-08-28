import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { KeyService } from '@services/key';

@Component({
  selector: 'key-card-create',
  templateUrl: './index.html'
})
export class KeyCreateCardComponent {

  @Input()
  userId: string;

  @Output()
  reset = new EventEmitter;

  @Output()
  create = new EventEmitter<ApiTokenObject>();

  keyName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);

  constructor(private keyService: KeyService) { }

  async createKey() {
    const name = this.keyName.value;

    const newapiToken = await this.keyService.create(this.userId, { name });

    this.keyName.reset();
    this.reset.emit();
    this.create.emit(newapiToken);
  }

  cancelKey() {
    this.keyName.reset();
    this.reset.emit();
  }

  getErrorMessage() {

    const err = Object.keys(this.keyName.errors)[0];

    switch (err) {
      case 'required':
        return 'You must enter a value';
      case 'minlength':
        return 'Must be 3 character min';
      case 'maxlength':
        return 'Must be 15 character max';
      default:
        return '';
    }

  }

}
