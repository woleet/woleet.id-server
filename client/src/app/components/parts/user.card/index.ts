import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '@services/user';

@Component({
  selector: 'app-user-card',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserCardComponent {

  @Input()
  modes: ('edit' | 'detail' | 'delete')[];

  @Input()
  user: ApiUserObject;

  @Output()
  delete = new EventEmitter<ApiUserObject>();

  @Output()
  update = new EventEmitter<ApiUserObject>();

  constructor(private userSerive: UserService) { }

  async deleteUser() {
    const del = await this.userSerive.delete(this.user.id);
    this.delete.emit(del);
  }

  async blockUser() {
    const up = await this.userSerive.update(this.user.id, { status: 'blocked' });
    this.user = up;
    this.update.emit(up);
  }

  async unblockUser() {
    const up = await this.userSerive.update(this.user.id, { status: 'active' });
    this.user = up;
    this.update.emit(up);
  }

}
