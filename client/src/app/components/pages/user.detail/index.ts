import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@services/user';
import { KeyService } from '@services/key';
import { TrackById } from '../../util';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserDetailPageComponent extends TrackById implements OnInit {

  user$: Promise<ApiUserObject>;

  keys$: Promise<ApiKeyObject[]>;

  formOpened = false;

  constructor(private userService: UserService, private keyService: KeyService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit() {
    this.user$ = this.userService.getById(this.route.snapshot.params.id);
    this.refreshKeyList();
  }

  refreshKeyList() {
    this.keys$ = this.keyService.getByUser(this.route.snapshot.params.id);
  }

  updateUserView(user) {
    this.user$ = Promise.resolve(user);
  }

  userDeleted(user) {
    this.router.navigate(['users']);
  }

}
