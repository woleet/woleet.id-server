import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  private authenticated = false;

  constructor(private router: Router) { }

  async logout() {
    // localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }

  async login(user) {
    console.log('login', user)
    return this.authenticated = true;
  }

  async isAuthenticated(): Promise<boolean> {
    return this.authenticated;
  }

}
