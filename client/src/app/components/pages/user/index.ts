import { Component, OnInit } from '@angular/core';
import { InfoService } from '@services/info';

@Component({
  templateUrl: './user.html'
})
export class UserPageComponent implements OnInit {

  info$: Promise<ApiUserDTOObject>;

  constructor(private service: InfoService) {
  }

  ngOnInit() {
    this.info$ = this.service.getInfo();
  }
}
