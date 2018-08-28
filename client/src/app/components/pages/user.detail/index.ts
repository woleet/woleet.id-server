import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {KeyService} from '@services/key';
import {TrackById} from '../../util';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class UserDetailPageComponent extends TrackById implements OnInit {

  userId = null;

  keys$: Promise<ApiTokenObject[]>;

  formOpened = false;

  constructor(private keyService: KeyService, private route: ActivatedRoute) {
    super();
    this.userId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.refreshKeyList();
  }

  refreshKeyList() {
    this.keys$ = this.keyService.getByUser(this.userId);
  }

}
