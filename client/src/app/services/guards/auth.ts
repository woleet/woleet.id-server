import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '@services/auth';
import { mainRoute } from '@app/config';
import { ErrorService } from '@services/error';

let i = 1000;

@Injectable()
export class UserGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }
  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }

    if (!i--) {
      throw new Error('Redirect loop detected');
    }

    this.router.navigate(['login']);
    return false;
  }
}

@Injectable()
export class AdminGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }
  canActivate(): boolean {
    if (this.auth.isAuthenticated() && this.auth.isAdmin()) {
      return true;
    }

    if (!i--) {
      throw new Error('Redirect loop detected');
    }

    this.router.navigate([mainRoute]);
    return false;
  }
}

/**
 * Return true if has error
 */
@Injectable()
export class ErrorGuardService implements CanActivate {
  constructor(private errorService: ErrorService, private router: Router) { }
  canActivate(): boolean {
    if (this.errorService.hasError()) {
      return true;
    }

    this.router.navigate([mainRoute]);
    return false;
  }
}

@Injectable()
export class AnonymousGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      return true;
    }

    if (!i--) {
      throw new Error('Redirect loop detected');
    }

    this.router.navigate([mainRoute]);
    return false;
  }
}
