import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserListPageComponent implements OnInit {

  users$: Promise<ApiUserObject[]>;

  constructor(private service: UserService) { }

  ngOnInit() {
    this.users$ = this.service.getAll();
  }

}
