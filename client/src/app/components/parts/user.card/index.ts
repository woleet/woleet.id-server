import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '@services/user';
import { AsYouType } from 'libphonenumber-js';
import { confirm } from '../../util';
import cc from '@components/cc';

@Component({
  selector: 'app-user-card',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserCardComponent implements OnInit {

  formLocked = false;
  editMode = false;
  userType: string;

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

  ngOnInit() {
    this.userType = this.user.mode === 'esign' ? 'user' : 'seal';
  }

  setEditMode(active) {
    this.editMode = active;
  }

  async deleteUser() {
    if (!confirm(`Delete ${this.userType} ${this.user.identity.commonName}?\n\n`
      + `Warning: deleting a ${this.userType} is irreversible, and also deletes all associated keys and API tokens.\n`
      + `Consequently, signatures made with this ${this.userType}'s keys will no longer be linked to this identity, `
      + `and keys ownership will no longer be provable by the identity server.`)) {
      return;
    }
    this.formLocked = true;
    const del = await this.userService.delete(this.user.id);
    this.formLocked = false;
    this.delete.emit(del);
  }

  async blockUser() {
    if (!confirm(`Block ${this.userType} ${this.user.identity.commonName}?`)) {
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

  /**
   * Get country name from country code.
   * @param code country code
   * @return country name
   */
  getCountryName(code: string): string {
    const country = cc.find(({ code: c }) => c === code);
    return (country && country.name);
  }

  getPhone(user: ApiUserObject): string {
    return user.phone ? new AsYouType().input('+' + user.countryCallingCode + user.phone) : '-';
  }
}
