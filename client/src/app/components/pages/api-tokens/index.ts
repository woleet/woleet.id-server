import { Component, OnInit } from '@angular/core';
import { APITokenService } from '@services/api-token';
import { TrackById } from '@components/util';

@Component({
  templateUrl: './index.html'
})
export class APITokensPageComponent extends TrackById implements OnInit {

  formOpened = false;

  apiTokens$: Promise<ApiAPITokenObject[]>;

  constructor(private apiTokenService: APITokenService) {
    super();
  }

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.apiTokens$ = this.apiTokenService.getAll();
  }
}
