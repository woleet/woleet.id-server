import { Component, OnInit } from '@angular/core';
import { APIKeyService } from '@services/api-key';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class APIKeysPageComponent implements OnInit {

  formOpened = false;

  apiKeys$: Promise<ApiAPIKeyObject[]>;

  constructor(private apiKeyService: APIKeyService) { }

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.apiKeys$ = this.apiKeyService.getAll();
  }

}
