import { Component } from '@angular/core';
import { AuthService } from '@services/auth';
import { environment } from '@env/environment';
import { PageDataService } from '@services/page-data';
import { ErrorService } from '@services/error';

@Component({
  selector: 'nav-bar',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class NavBarComponent {
  production = false;
  lock$;

  constructor(
    private authService: AuthService,
    private pageDataService: PageDataService,
    private errorService: ErrorService
  ) {
    this.production = environment.production;
    this.lock$ = authService.lock$;
  }

  logout() {
    this.authService.logout();
  }

  hide() {
    return this.pageDataService.hideNav() || this.errorService.hasError();
  }

  page() {
    return this.pageDataService.getTitle();
  }

  commonName() {
    return this.authService.isAuthenticated() && this.authService.getUser().identity.commonName;
  }

  isAdmin() {
    return this.authService.isAdmin();
  }
}
