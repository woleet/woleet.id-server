import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KeyService } from '@services/key';
import { FormControl, Validators } from '@angular/forms';
import { ErrorMessageProvider } from '@components/util';
import { UserService } from '@services/user';
import { confirm } from '../../util';

@Component({
  selector: 'app-key-card',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class KeyCardComponent extends ErrorMessageProvider {

  editMode = false;

  keyName: FormControl;
  setAsDefault = false;

  @Input()
  modes: ('block' | 'edit' | 'delete')[] = [];

  @Input()
  userId: string;

  @Input()
  key: ApiKeyObject;

  @Input()
  default = false;

  @Output()
  delete = new EventEmitter<ApiKeyObject>();

  @Output()
  update = new EventEmitter<ApiKeyObject>();

  @Output()
  updateUser = new EventEmitter<ApiKeyObject>();

  constructor(private keyService: KeyService, private userService: UserService) {
    super();
    this.setAsDefault = this.default;
  }

  setEditMode(active) {
    this.editMode = active;
    if (this.editMode) {
      this.keyName = new FormControl(this.key.name, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);
      this.setAsDefault = this.default;
    }
  }

  async deleteKey() {
    if (!confirm(`Delete key ${this.key.name} ?`)) {
      return;
    }
    const del = await this.keyService.delete(this.key.id);
    this.key = del;
    this.delete.emit(del);
  }

  async editKey() {
    const name = this.keyName.value;

    if (name !== this.key.name) {
      const up = await this.keyService.update(this.key.id, { name });
      this.key = up;
      this.update.emit();
    }

    if (this.default !== this.setAsDefault) {
      await this.userService.update(this.userId, { defaultKeyId: this.setAsDefault ? this.key.id : null });
      this.updateUser.emit();
    }

    this.setEditMode(false);
  }

  async blockKey() {
    if (!confirm(`Block key ${this.key.name} ?`)) {
      return;
    }
    const up = await this.keyService.update(this.key.id, { status: 'blocked' });
    this.key = up;
    this.update.emit();
  }

  async unblockKey() {
    const up = await this.keyService.update(this.key.id, { status: 'active' });
    this.key = up;
    this.update.emit();
  }

}
