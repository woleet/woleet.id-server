import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserCardComponent {

  @Input()
  mode: 'edit' | 'detail';

  @Input()
  user: ApiUserObject;

}
