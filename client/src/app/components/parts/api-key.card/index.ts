import { Component, Input } from '@angular/core';
import { APIKeyService } from '@services/api-key';

@Component({
  selector: 'app-api-key-card',
  templateUrl: './index.html'
})
export class APIKeyCardComponent {

  constructor(private apiKeyService: APIKeyService) { }

  @Input()
  apiKey: ApiAPIKeyObject;
  displayApiKey = false;

  async deleteKey() {
    console.log(`Deleting ${this.apiKey.id}`)
    await this.apiKeyService.delete(this.apiKey.id); // todo update view
  }

  reveal() {
    this.displayApiKey = true;
    setTimeout(() => this.displayApiKey = false, 5 * 1000)
  }

}
