import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@services/user';
import { KeyService } from '@services/key';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserDetailPageComponent implements OnInit {

  user$: Promise<ApiUserObject>;

  keys$: Promise<ApiKeyObject[]>

  formOpened = false;

  constructor(private userService: UserService, private keyService: KeyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user$ = this.userService.getById(this.route.snapshot.params.id);
    this.refreshKeyList();
  }

  refreshKeyList() {
    this.keys$ = this.keyService.getByUser(this.route.snapshot.params.id);
  }

}
