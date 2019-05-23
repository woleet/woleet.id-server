import { Component, ChangeDetectorRef } from '@angular/core';
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
  mode = 'side';
  opened = true;

  constructor(
    private authService: AuthService,
    private pageDataService: PageDataService,
    private errorService: ErrorService,
    private ref: ChangeDetectorRef
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
    if (this.authService.isAuthenticated()) {
      return this.authService.getUser().identity.commonName;
    } else {
      return 'Logout...';
    }
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  collapseSideBar() {
    this.opened = !this.opened;
  }
}
