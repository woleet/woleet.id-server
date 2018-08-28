import {Component, EventEmitter, Input, Output} from '@angular/core';
import {APITokenService} from '@services/api-token';

@Component({
  selector: 'app-api-token-card',
  templateUrl: './index.html'
})
export class APITokenCardComponent {

  constructor(private apiTokenService: APITokenService) {
  }

  @Input()
  apiToken: ApiAPITokenObject;

  @Output()
  delete = new EventEmitter<ApiAPITokenObject>();

  @Output()
  update = new EventEmitter<ApiAPITokenObject>();

  displayApiToken = false;

  async deleteToken() {
    const deleted = await this.apiTokenService.delete(this.apiToken.id);
    this.apiToken = deleted;
    this.delete.emit(deleted);
  }

  async blockToken() {
    const up = await this.apiTokenService.update(this.apiToken.id, {status: 'blocked'});
    this.apiToken = up;
    this.update.emit(up);
  }

  async unblockToken() {
    const up = await this.apiTokenService.update(this.apiToken.id, {status: 'active'});
    this.apiToken = up;
    this.update.emit(up);
  }

  reveal() {
    this.displayApiToken = true;
    setTimeout(() => this.displayApiToken = false, 5 * 1000);
  }
}
