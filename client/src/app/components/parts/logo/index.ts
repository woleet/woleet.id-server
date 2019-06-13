import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'logo',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class LogoComponent implements OnInit {

  @Input()
  logoURL: ApiServerConfig['publicInfo']['logoURL'];

  currentLogoURL: string;
  defaultLogoURL: string;

  constructor() {
  }

  ngOnInit() {
    this.defaultLogoURL = '/assets/logo.svg';
    this.currentLogoURL = this.logoURL || this.defaultLogoURL;
  }
}
