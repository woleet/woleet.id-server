import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KeyService } from '@services/key';

@Component({
  selector: 'app-key-card',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class KeyCardComponent {

  constructor(private keyService: KeyService) { }

  @Output()
  delete = new EventEmitter<ApiKeyObject>();

  @Input()
  key: ApiKeyObject;

  async deleteKey() {
    console.log(`Deleting ${this.key.id}`)
    await this.keyService.delete(this.key.id);
    this.delete.emit();
  }

}
