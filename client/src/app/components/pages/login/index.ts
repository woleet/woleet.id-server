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

  async login() {
    const user = await this.service.login(this.user);
    if (user) {
      if (user.role === 'admin') {
        this.router.navigate(['users'])
      } else {
        this.router.navigate([mainRoute])
      }
    } else {
      // this.errorMsg = 'Failed to login! try again ...';
    }
  }
}
