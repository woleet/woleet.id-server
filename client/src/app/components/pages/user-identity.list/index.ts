import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user';
import { AuthService } from '@services/auth';
import { TrackById } from '@components/util';

@Component({
  templateUrl: './index.html'
})
export class UserIdentityListPageComponent extends TrackById implements OnInit {

  search = null;

  formOpened = false;

  users: ApiUserObject[];
  complete = false;

  private pageSize = 20;
  private offset;

  constructor(private service: UserService, private authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.refreshUserList();
  }

  refreshUserList() {
    this.service.getAll({ search: this.search, mode: 'esign', offset: 0, limit: this.pageSize })
      .then(firstPage => {
        this.complete = (firstPage.length < this.pageSize);
        this.offset = firstPage.length;
        this.users = firstPage;
      });
  }

  getMoreUsers() {
    this.service.getAll({ mode: 'esign', offset: this.offset, limit: this.pageSize })
      .then(nextPage => {
        this.complete = (nextPage.length < this.pageSize);
        this.offset += nextPage.length;
        this.users = this.users.concat(nextPage);
      });
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  isManager() {
    return this.authService.isManager();
  }
}
