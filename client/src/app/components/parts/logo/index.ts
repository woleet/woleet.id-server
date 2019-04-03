import { ServerConfigService as ConfigService } from '@services/server-config';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'logo',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class LogoComponent implements OnInit {

  @Input()
  logoURL: ApiServerConfig['publicInfo']['logoURL'];

  logo: string;
  defaultLogo: string;

  constructor(private configService: ConfigService) {
  }

  ngOnInit() {
    this.defaultLogo = '/assets/logo.svg';
    this.logo = this.logoURL || this.defaultLogo;
  }
}
