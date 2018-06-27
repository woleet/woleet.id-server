import { Component } from '@angular/core';
import { AuthService } from '@services/authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class LoginPageComponent {

  user: { username, password };

  constructor(private service: AuthService, private router: Router) {
    this.user = { username: '', password: '' };
  }

  login() {
    if (this.service.login(this.user)) {
      this.router.navigate(['main'])
    } else {
      // this.errorMsg = 'Failed to login! try again ...';
    }
  }
}
