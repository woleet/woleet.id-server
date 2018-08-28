import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { APITokenService } from '@services/api-token';

@Component({
  selector: 'api-token-create-card',
  templateUrl: './index.html'
})
export class APITokenCreateCardComponent {

  @Output()
  reset = new EventEmitter;

  @Output()
  create = new EventEmitter<ApiAPITokenObject>();

  apiTokenName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);

  constructor(private apiTokenService: APITokenService) { }

  async createAPIToken() {
    const name = this.apiTokenName.value;

    const newapiToken = await this.apiTokenService.create({ name });

    this.apiTokenName.reset();
    this.reset.emit();
    this.create.emit(newapiToken);
  }

  cancelAPIToken() {
    this.apiTokenName.reset();
    this.reset.emit();
  }

  getErrorMessage() {

    const err = Object.keys(this.apiTokenName.errors)[0];

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
