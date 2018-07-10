import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '@services/auth';
import { mainRoute } from '@app/config';

let i = 100;

@Injectable()
export class UserGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) { }
  canActivate(): boolean {
    if (this.auth.isAuthenticated())
      return true;

    if (!i--)
      throw new Error('Redirect loop detected');

    this.router.navigate(['login']);
    return false;
  }
}

@Injectable()
export class AdminGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) { }
  canActivate(): boolean {
    if (this.auth.isAuthenticated() && this.auth.isAdmin())
      return true;

    if (!i--)
      throw new Error('Redirect loop detected');

    this.router.navigate([mainRoute]);
    return false;
  }
}


@Injectable()
export class AnonymousGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) { }
  canActivate(): boolean {
    if (!this.auth.isAuthenticated())
      return true;

    if (!i--)
      throw new Error('Redirect loop detected');

    this.router.navigate([mainRoute]);
    return false;
  }
}
