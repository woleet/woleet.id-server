import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth';
import { environment } from '@env/environment';
import { PageDataService } from '@services/page-data';

@Component({
  selector: 'nav-bar',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class NavBarComponent {

  production = false;

  constructor(private router: Router, private auth: AuthService, private pageDataService: PageDataService) {
    this.production = environment.production;
  }

  logout() {
    this.auth.logout();
  }

  hide() {
    return this.pageDataService.hideNav();
  }

  page() {
    return this.pageDataService.getTitle();
  }

  commonName() {
    return this.auth.isAuthenticated() && this.auth.getUser().identity.commonName;
  }

  isAdmin() {
    return this.auth.isAdmin();
  }

}
