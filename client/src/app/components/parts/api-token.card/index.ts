import { Component, EventEmitter, Input, Output } from '@angular/core';
import { APITokenService } from '@services/api-token';
import { FormControl, Validators } from '@angular/forms';
import { ErrorMessageProvider } from '@components/util';

@Component({
  selector: 'api-token-card',
  templateUrl: './index.html'
})
export class APITokenCardComponent extends ErrorMessageProvider {

  editMode = false;

  apiTokenName: FormControl;

  constructor(private apiTokenService: APITokenService) {
    super();
  }

  @Input()
  apiToken: ApiAPITokenObject;

  @Output()
  delete = new EventEmitter<ApiAPITokenObject>();

  @Output()
  update = new EventEmitter<ApiAPITokenObject>();

  displayApiToken = false;

  setEditMode(active) {
    this.editMode = active;
    if (this.editMode) {
      this.apiTokenName = new FormControl(this.apiToken.name, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);
    }
  }

  async editToken() {
    const name = this.apiTokenName.value;

    if (name !== this.apiToken.name) {
      const up = await this.apiTokenService.update(this.apiToken.id, { name });
      this.update.emit(up);
      this.apiToken = up;
    }

    this.setEditMode(false);
  }

  async deleteToken() {
    const deleted = await this.apiTokenService.delete(this.apiToken.id);
    this.apiToken = deleted;
    this.delete.emit(deleted);
  }

  async blockToken() {
    const up = await this.apiTokenService.update(this.apiToken.id, { status: 'blocked' });
    this.apiToken = up;
    this.update.emit(up);
  }

  async unblockToken() {
    const up = await this.apiTokenService.update(this.apiToken.id, { status: 'active' });
    this.apiToken = up;
    this.update.emit(up);
  }

  reveal() {
    this.displayApiToken = true;
    setTimeout(() => this.displayApiToken = false, 5 * 1000);
  }
}
