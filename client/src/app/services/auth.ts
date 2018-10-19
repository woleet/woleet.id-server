import { Injectable } from '@angular/core';
import { Router, Params } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { serverURL } from './config';
import { BootService } from '@services/boot';
import { Lock } from '@components/util';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private lock: Lock;
  public lock$: Observable<boolean>;
  private user: ApiUserDTOObject = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private bootService: BootService
  ) {

    const user = localStorage.getItem('user');
    this.lock = new Lock();
    this.lock$ = this.lock.asObservable();

    if (user) {
      try {
        this.user = JSON.parse(user);
      } catch { }
    }
  }

  async logout(request = true) {
    this.lock.incr();
    this.user = null;
    localStorage.removeItem('user');
    if (request) {
      this.http.get(`${serverURL}/logout/`).toPromise().catch(() => null);
    }
    this.router.navigate(['login']);
    this.bootService.restart();
    this.lock.decr();
  }

  async login(user: BasicAuthObject): Promise<ApiUserDTOObject | null> {
    this.lock.incr();
    const headers = (new HttpHeaders()).append('Authorization', 'Basic ' + btoa(`${user.username}:${user.password}`));
    const auth: AuthResponseObject = await this.http.get<AuthResponseObject>(`${serverURL}/login/`, { headers })
      .toPromise()
      .catch(() => null);
    this.lock.decr();
    if (!auth) {
      return null;
    }

    this.user = auth.user;
    localStorage.setItem('user', JSON.stringify(auth.user));

    return this.user;
  }

  getUser(): ApiUserDTOObject {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }

  isAdmin(): boolean {
    return this.isAuthenticated() && this.user.role === 'admin';
  }

  async openid() {
    this.lock.incr();
    document.location.href = `${serverURL}/oauth/login`;
  }

  async forwardOAuth(params: Params) {
    this.lock.incr();
    const auth: AuthResponseObject = await this.http.get<AuthResponseObject>(`${serverURL}/oauth/callback`, { params }).toPromise();
    this.lock.decr();

    if (!auth) {
      return null;
    }

    this.user = auth.user;
    localStorage.setItem('user', JSON.stringify(auth.user));

    return auth.user;
  }

}
