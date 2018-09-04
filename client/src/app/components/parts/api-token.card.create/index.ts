import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { APITokenService } from '@services/api-token';
import { ErrorMessageProvider } from '@components/util';

@Component({
  selector: 'api-token-create-card',
  templateUrl: './index.html'
})
export class APITokenCreateCardComponent extends ErrorMessageProvider {

  @Output()
  reset = new EventEmitter;

  @Output()
  create = new EventEmitter<ApiAPITokenObject>();

  apiTokenName = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);

  constructor(private apiTokenService: APITokenService) { super(); }

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

}
