import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeyService } from '@services/key';
import { TrackById } from '../../util';
import { UserService } from '@services/user';

@Component({
  templateUrl: './index.html'
})
export class UserDetailPageComponent extends TrackById implements OnInit {

  userId = null;

  keys$: Promise<ApiKeyObject[]>;

  user$: Promise<ApiUserObject>;

  formOpened = false;
  externalFormOpened = false;

  constructor(private keyService: KeyService, private userService: UserService, private route: ActivatedRoute) {
    super();
    this.userId = this.route.snapshot.params.id;
    this.user$ = this.userService.getById(this.userId);
  }

  ngOnInit() {
    this.refreshKeyList();
  }

  refreshKeyList() {
    this.keys$ = this.keyService.getByUser(this.userId);
    this.user$ = this.userService.getById(this.userId);
  }

  refreshUser() {
    this.user$ = this.userService.getById(this.userId);
  }

  sendEnrolmentMail() {

  }
}
