import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '@services/user';
import { confirm } from '../../util';
import cc from '@components/cc';

@Component({
  selector: 'app-user-card',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserCardComponent {

  editMode = false;

  @Input()
  modes: ('block' | 'edit' | 'detail' | 'delete')[];

  @Input()
  user: ApiUserObject;

  @Output()
  delete = new EventEmitter<ApiUserObject>();

  @Output()
  update = new EventEmitter<ApiUserObject>();

  constructor(private userSerive: UserService) { }

  setEditMode(active) {
    this.editMode = active;
  }

  async deleteUser() {
    if (!confirm(`Delete user ${this.user.identity.commonName} ?`)) {
      return;
    }
    const del = await this.userSerive.delete(this.user.id);
    this.delete.emit(del);
  }

  async blockUser() {
    if (!confirm(`Block user ${this.user.identity.commonName} ?`)) {
      return;
    }
    const up = await this.userSerive.update(this.user.id, { status: 'blocked' });
    this.user = up;
    this.update.emit(up);
  }

  async unblockUser() {
    const up = await this.userSerive.update(this.user.id, { status: 'active' });
    this.user = up;
    this.update.emit(up);
  }

  getCountry(code) {
    const country = cc.find(({ code: c }) => c === code);
    return country && country.name;
  }

}
