import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth';

@Component({
  selector: 'nav-bar',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class NavBarComponent {

  constructor(public router: Router, private auth: AuthService) { }

  logout() {
    this.auth.logout()
  }

  isAdmin() {
    return this.auth.isAdmin()
  }

}
