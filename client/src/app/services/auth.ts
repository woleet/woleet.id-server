import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const serverURL = 'http://localhost:3000'


@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  async logout() {
    localStorage.removeItem('session');
    this.router.navigate(['/login']);
  }

  async login(user: BasicAuthObject) {
    console.log('login', user)

    const headers = (new HttpHeaders()).append("Authorization", "Basic " + btoa(`${user.username}:${user.password}`));
    const auth: AuthResponseObject = await this.http.get<AuthResponseObject>(`${serverURL}/login/`, { headers })
      .toPromise().catch(() => null);

    if (!auth)
      return false;

    console.log('Logged', { auth });

    localStorage.setItem('session', auth.token);
    localStorage.setItem('admin', auth.admin ? 'admin' : '');
    this.router.navigate(['main']);
  }

  getToken(): string {
    return localStorage.getItem('session');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('session');
  }

  isAdmin(): boolean {
    return localStorage.getItem('admin') === 'admin';
  }

}
