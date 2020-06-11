import { Component, OnInit } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider } from '@components/util';
import { Observable } from 'rxjs';

@Component({
  selector: 'config-password',
  templateUrl: './index.html'
})
export class ConfigBlockPasswordInputComponent extends ErrorMessageProvider implements OnInit {

  config$: Observable<ApiServerConfig>;

  constructor(private configService: ConfigService) {
    super();
  }

  ngOnInit() {
    this.config$ = this.configService.getConfig();
  }

  update(blockPasswordInput: boolean) {
    this.configService.updateConfig({ blockPasswordInput });
  }
}
