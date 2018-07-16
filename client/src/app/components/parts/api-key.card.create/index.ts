import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { APIKeyService } from '@services/api-key';

@Component({
  selector: 'api-key-create-card',
  templateUrl: './index.html'
})
export class APIKeyCreateCardComponent {

  @Output()
  reset = new EventEmitter;

  @Output()
  create = new EventEmitter<ApiAPIKeyObject>();

  apiKeyName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);

  constructor(private apiKeyService: APIKeyService) { }

  async createAPIKey() {
    const name = this.apiKeyName.value;

    const newApiKey = await this.apiKeyService.create({ name });

    this.apiKeyName.reset();
    this.reset.emit();
    this.create.emit(newApiKey);
  }

  cancelAPIKey() {
    this.apiKeyName.reset();
    this.reset.emit();
  }

  getErrorMessage() {

    const err = Object.keys(this.apiKeyName.errors)[0];

    switch (err) {
      case 'required':
        return 'You must enter a value'
      case 'minlength':
        return 'Must be 3 character min'
      case 'maxlength':
        return 'Must be 15 character max'
      default:
        return ''
    }

  }

}
