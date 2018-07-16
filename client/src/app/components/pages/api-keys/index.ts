import { Component, OnInit } from '@angular/core';
import { APIKeyService } from '@services/api-key';
import { TrackById } from '@components/util';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class APIKeysPageComponent extends TrackById implements OnInit {

  formOpened = false;

  apiKeys$: Promise<ApiAPIKeyObject[]>;

  constructor(private apiKeyService: APIKeyService) { super() }

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.apiKeys$ = this.apiKeyService.getAll();
  }

}
