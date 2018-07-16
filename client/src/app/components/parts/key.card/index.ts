import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KeyService } from '@services/key';

@Component({
  selector: 'app-key-card',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class KeyCardComponent {

  @Input()
  key: ApiKeyObject;

  @Output()
  delete = new EventEmitter<ApiKeyObject>();

  @Output()
  update = new EventEmitter<ApiKeyObject>();

  constructor(private keyService: KeyService) { }

  async deleteKey() {
    const del = await this.keyService.delete(this.key.id);
    this.key = del;
    this.delete.emit(del);
  }

  async blockKey() {
    const up = await this.keyService.update(this.key.id, { status: 'blocked' });
    this.key = up;
    this.update.emit(up);
  }

  async unblockKey() {
    const up = await this.keyService.update(this.key.id, { status: 'active' });
    this.key = up;
    this.update.emit(up);
  }

}
