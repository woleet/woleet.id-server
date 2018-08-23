import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private keyService: KeyService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit() {
    this.refreshKeyList();
  }

  refreshKeyList() {
    this.keys$ = this.keyService.getByUser(this.route.snapshot.params.id);
  }

  userDeleted(user) {
    this.router.navigate(['users']);
  }

}
