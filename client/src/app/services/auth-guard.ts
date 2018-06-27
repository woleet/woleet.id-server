import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './authentication';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) { }
  async canActivate(): Promise<boolean> {
    if (!(await this.auth.isAuthenticated())) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
