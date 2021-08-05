import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user';
import { AuthService } from '@services/auth';
import { TrackById } from '@components/util';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserIdentityListPageComponent extends TrackById implements OnInit {

  formOpened = false;

  users$: Promise<ApiUserObject[]>;

  constructor(private service: UserService, private authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.refreshUserList();
  }

  refreshUserList() {
    this.users$ = this.service.getAll({ mode: 'esign', limit: 100 });
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  isManager() {
    return this.authService.isManager();
  }
}
