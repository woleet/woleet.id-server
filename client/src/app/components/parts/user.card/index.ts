import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '@services/user';
import { AsYouType } from 'libphonenumber-js';
import { confirm } from '../../util';
import cc from '@components/cc';

@Component({
  selector: 'app-user-card',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserCardComponent {

  formLocked = false;
  editMode = false;

  @Input()
  modes: ('block' | 'edit' | 'detail' | 'delete' | 'display')[];

  @Input()
  user: ApiUserObject;

  @Input()
  hideAttribute?: ('username' | 'email' | 'phone')[];

  @Output()
  delete = new EventEmitter<ApiUserObject>();

  @Output()
  update = new EventEmitter<ApiUserObject>();

  constructor(private userService: UserService) {
    if (!this.hideAttribute) {
      this.hideAttribute = [];
    }
   }

  setEditMode(active) {
    this.editMode = active;
  }

  async deleteUser() {
    if (!confirm(`Delete user ${this.user.identity.commonName}?`)) {
      return;
    }
    this.formLocked = true;
    const del = await this.userService.delete(this.user.id);
    this.formLocked = false;
    this.delete.emit(del);
  }

  async blockUser() {
    if (!confirm(`Block user ${this.user.identity.commonName}?`)) {
      return;
    }
    this.formLocked = true;
    const up = await this.userService.update(this.user.id, { status: 'blocked' });
    this.formLocked = false;
    this.user = up;
    this.update.emit(up);
  }

  async unblockUser() {
    this.formLocked = true;
    const up = await this.userService.update(this.user.id, { status: 'active' });
    this.formLocked = false;
    this.user = up;
    this.update.emit(up);
  }

  getCountry(code) {
    const country = cc.find(({ code: c }) => c === code);
    return (country && country.name);
  }

  getPhone(user) {
    return user.phone ? new AsYouType().input('+' + user.countryCallingCode + user.phone) : '-';
  }
}
