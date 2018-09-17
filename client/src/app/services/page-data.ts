import { Injectable } from '@angular/core';

@Injectable()
export class PageDataService {

  title = '';
  _hideNav = false;

  getTitle() { return this.title; }

  hideNav() { return this._hideNav; }

  setData(data) {
    this.title = data.title;
    this._hideNav = data.hideNav || false;
  }

}
