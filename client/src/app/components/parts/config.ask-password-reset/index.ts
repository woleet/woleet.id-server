import { Component, OnInit } from '@angular/core';
import { ServerConfigService as ConfigService } from '@services/server-config';
import { ErrorMessageProvider } from '@components/util';
import { Observable } from 'rxjs';
import { UserService } from '@services/user';

@Component({
  selector: 'config-ask-reset',
  templateUrl: './index.html'
})
export class ConfigAskResetPasswordInputComponent extends ErrorMessageProvider implements OnInit {

  config$: Observable<ApiServerConfig>;
  userList$: Promise<ApiUserObject[]>;

  constructor(private configService: ConfigService,
    private userService: UserService) {
    super();
  }

  ngOnInit() {
    this.config$ = this.configService.getConfig();
    this.userList$ = this.userService.getAll();
  }

  update(askForResetInput: boolean) {
    this.configService.update({ askForResetInput });
  }

  // Search all active manager or admin with an email disable the checkbox if no one is found.
  checkManagerAvailable(users: ApiUserObject[]): boolean {
    let managers = users.filter((user) => user.role === 'manager' && user.email && user.status === 'active');
    if (!managers.length) {
      managers = users.filter((user) => user.role === 'admin' && user.email && user.status === 'active');
      if (!managers.length) {
        return false;
      }
    }
    return true;
  }
}
