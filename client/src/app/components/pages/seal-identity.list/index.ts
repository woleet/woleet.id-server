import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user';
import { AuthService } from '@services/auth';
import { TrackById } from '@components/util';

@Component({
  templateUrl: './index.html'
})
export class SealIdentityListPageComponent extends TrackById implements OnInit {

  formOpened = false;

  users$: Promise<ApiUserObject[]>;

  filterUserSeal = { mode: 'seal' };

  constructor(private service: UserService, private authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.refreshUserList();
  }

  refreshUserList() {
    this.users$ = this.service.getAll();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  isManager() {
    return this.authService.isManager();
  }
}
