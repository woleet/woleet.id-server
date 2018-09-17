import { Component, OnInit } from '@angular/core';
import { ErrorService } from '@services/error';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class ErrorPageComponent implements OnInit {

  message = null;
  tip = null;

  constructor(private errorService: ErrorService) {

  }

  ngOnInit() {
    const error = this.errorService.getError();
    const type = error.type || 'unknown';
    switch (type) {
      case 'network':
        this.message = 'Network error :(';
        this.tip = 'Please check your internet connection';
        break;
      case 'unknown':
      default:
        this.message = 'Unknown error :(';
        this.tip = 'Try to reload this page or try later';
        break;
    }
  }

}
