import { Component, Input, Output, EventEmitter } from '@angular/core';
import { APIKeyService } from '@services/api-key';

@Component({
  selector: 'app-api-key-card',
  templateUrl: './index.html'
})
export class APIKeyCardComponent {

  constructor(private apiKeyService: APIKeyService) { }

  @Input()
  apiKey: ApiAPIKeyObject;

  @Output()
  delete = new EventEmitter<ApiAPIKeyObject>();

  @Output()
  update = new EventEmitter<ApiAPIKeyObject>();

  displayApiKey = false;

  async deleteKey() {
    const deleted = await this.apiKeyService.delete(this.apiKey.id);
    this.apiKey = deleted;
    this.delete.emit(deleted);
  }

  async blockKey() {
    const up = await this.apiKeyService.update(this.apiKey.id, { status: 'blocked' });
    this.apiKey = up;
    this.update.emit(up);
  }

  async unblockKey() {
    const up = await this.apiKeyService.update(this.apiKey.id, { status: 'active' });
    this.apiKey = up;
    this.update.emit(up);
  }

  reveal() {
    this.displayApiKey = true;
    setTimeout(() => this.displayApiKey = false, 5 * 1000)
  }

}
