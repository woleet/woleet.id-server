import { Component, OnInit } from '@angular/core';
import { InfoService } from '@services/info';
import { TrackById } from '@components/util';

@Component({
  templateUrl: './index.html'
})
export class UserPageComponent extends TrackById implements OnInit  {

  info$: Promise<ApiUserDTOObject>;
  keys$: Promise<ApiKeyObject[]>;
  formOpened = false;

  constructor(private service: InfoService) {
    super();
  }

  ngOnInit() {
    this.info$ = this.service.getInfo();
  }
}
