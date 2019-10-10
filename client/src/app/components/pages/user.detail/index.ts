import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user';
import { ActivatedRoute } from '@angular/router';
import { TrackById } from '../../util';

@Component({
  templateUrl: './index.html'
})
export class UserDetailPageComponent extends TrackById implements OnInit  {

  user$: Promise<ApiUserDTOObject>;
  formOpened = false;

  constructor(private userService: UserService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    const userId = this.route.snapshot.params.id;
    this.user$ = this.userService.getById(userId);
  }
}
