import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'logo',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class LogoComponent implements OnInit {

  @Input()
  logoURL: ApiServerConfig['logoURL'];

  currentLogoURL: string;
  defaultLogoURL: string;

  constructor() {
  }

  ngOnInit() {
    this.defaultLogoURL = '/assets/logo.png';
    this.currentLogoURL = this.logoURL || this.defaultLogoURL;
  }
}
