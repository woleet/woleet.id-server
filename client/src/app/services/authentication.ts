import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {

  constructor(private router: Router) { }

  async logout() {
    // localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }

  async login(user) {
    console.log('login', user)
    return true;
  }

}
