import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth';
import { environment } from '@env/environment';

@Component({
  selector: 'nav-bar',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class NavBarComponent {

  production = false;

  constructor(private router: Router, private auth: AuthService) {
    this.production = environment.production;
  }

  logout() {
    this.auth.logout();
  }

  url() {
    return this.router.url;
  }

  isAdmin() {
    return this.auth.isAdmin();
  }

}
