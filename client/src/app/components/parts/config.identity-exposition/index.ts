import { Component, OnInit } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider } from '@components/util';
import { Observable } from 'rxjs';

@Component({
  selector: 'config-identity-exposure',
  templateUrl: './index.html'
})
export class ConfigIdentityExposureComponent extends ErrorMessageProvider implements OnInit {

  config$: Observable<ApiServerConfig>;

  constructor(private configService: ConfigService) {
    super();
  }

  ngOnInit() {
    this.config$ = this.configService.getConfig();
  }

  update(preventIdentityExposure: boolean) {
    this.configService.updateConfig({ preventIdentityExposure });
  }
}
