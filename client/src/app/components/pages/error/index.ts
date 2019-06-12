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
      case 'no-server':
        this.message = 'Cannot reach the server';
        this.tip = 'Try to reload this page later';
        break;
      case 'server-error':
        console.log(error);
        this.message = `The server encountered an error:\n${error.message}`;
        break;
      case 'network':
        this.message = 'Network error';
        this.tip = 'Please check your internet connection';
        break;
      case 'redirect-parameter':
        this.message = 'Failed to decode redirect parameter';
        this.tip = `Please report this error to this website owner with the following:\n${error.message}`;
        break;
      case 'unknown':
      default:
        this.message = 'Unknown error';
        this.tip = 'Try to reload this page or try later';
        break;
    }
  }
}
