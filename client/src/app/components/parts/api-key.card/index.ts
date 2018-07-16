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

  displayApiKey = false;

  async deleteKey() {
    const deleted = await this.apiKeyService.delete(this.apiKey.id);
    this.delete.emit(deleted);
  }

  reveal() {
    this.displayApiKey = true;
    setTimeout(() => this.displayApiKey = false, 5 * 1000)
  }

}
