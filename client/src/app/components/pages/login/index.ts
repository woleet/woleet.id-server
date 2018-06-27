import { Component } from '@angular/core';
import { AuthenticationService } from '@services/authentication';

@Component({
  selector: 'app-login',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class LoginPageComponent {

  user: { username, password };

  constructor(private service: AuthenticationService) {
    this.user = { username: '', password: '' };
  }

  login() {
    if (!this.service.login(this.user)) {
      // this.errorMsg = 'Failed to login! try again ...';
    }
  }
}
