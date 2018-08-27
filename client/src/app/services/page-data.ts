import { Injectable } from '@angular/core';

@Injectable()
export class PageDataService {

  title = '';

  getTitle(): string { return this.title; }

  setTitle(title: string) { this.title = title; }

}
