import { Component, OnInit } from '@angular/core';
import { InfoService } from '@services/info';
import { UserKeyService } from '@services/key';
import { TrackById } from '@components/util';

@Component({
  templateUrl: './user.html'
})
export class UserPageComponent extends TrackById implements OnInit  {

  info$: Promise<ApiUserDTOObject>;
  keys$: Promise<ApiKeyObject[]>;
  formOpened = false;

  constructor(private service: InfoService, private keyService: UserKeyService) {
    super();
  }

  ngOnInit() {
    this.info$ = this.service.getInfo();
    this.info$.then(() => {
      this.keys$ = this.keyService.getAll();
    });
  }

  refreshKeyList() {
    this.keys$ = this.keyService.getAll();
    this.info$ = this.service.getInfo();
  }

  refreshUser() {
    this.info$ = this.service.getInfo();
  }

  key() {
    console.log(this.keys$);
  }
}
