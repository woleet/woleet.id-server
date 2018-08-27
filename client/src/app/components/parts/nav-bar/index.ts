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

  constructor(private router: Router, private auth: AuthService, private pageTitle: PageDataService) {
    this.production = environment.production;
  }

  logout() {
    this.auth.logout();
  }

  url() {
    return this.router.url;
  }

  page() {
    return this.pageTitle.getTitle();
  }

  commonName() {
    return this.auth.isAuthenticated() && this.auth.getUser().identity.commonName;
  }

  isAdmin() {
    return this.auth.isAdmin();
  }

}
