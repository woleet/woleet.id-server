import { Component, Input } from '@angular/core';

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

  delete() {
    console.log('Todo: delete ' + this.user.id);
  }

}
