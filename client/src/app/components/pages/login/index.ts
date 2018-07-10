import { Component } from '@angular/core';
import { AuthService } from '@services/auth';
import { Router } from '@angular/router';
import { mainRoute } from '@app/config';

@Component({
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class LoginPageComponent {

  user: BasicAuthObject;

  constructor(private service: AuthService, private router: Router) {
    this.user = { username: '', password: '' };
  }

  login() {
    if (this.service.login(this.user)) {
      this.router.navigate([mainRoute])
    } else {
      // this.errorMsg = 'Failed to login! try again ...';
    }
  }
}
