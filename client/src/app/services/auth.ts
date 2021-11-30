import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { serverURL } from './config';
import { AppConfigService, BootService } from '@services/boot';
import { Lock } from '@components/util';
import { Observable } from 'rxjs';

import { redirectForOIDC } from '@services/util';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private lock: Lock;
  public lock$: Observable<boolean>;
  private user: ApiUserDTOObject = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private bootService: BootService,
    appConfigService: AppConfigService,
  ) {
    this.lock = new Lock();
    this.lock$ = this.lock.asObservable();
    this.user = appConfigService.getConfig().user;
  }

  async logout(request = true) {
    this.lock.incr();
    this.user = null;
    if (request) {
      this.http.get(`${serverURL}/logout/`).toPromise()
        .then(() => {
          this.router.navigate(['login']);
          this.bootService.restart();
          this.lock.decr();
        })
        .catch(() => null);
    } else {
      this.router.navigate(['login']);
      this.bootService.restart();
      this.lock.decr();
    }
  }

  async login(user: BasicAuthObject): Promise<ApiUserDTOObject | null> {
    this.lock.incr();
    const headers = (new HttpHeaders()).append('Authorization', 'Basic ' + btoa(`${user.username}:${user.password}`));
    const auth: AuthResponseObject = await this.http.get<AuthResponseObject>(`${serverURL}/login`, { headers })
      .toPromise()
      .catch(() => null);
    this.lock.decr();
    if (!auth) {
      return null;
    }

    this.user = auth.user;
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

  isManager(): boolean {
    return this.isAuthenticated() && this.user.role === 'manager';
  }

  openid() {
    redirectForOIDC();
  }

  async forwardOAuth(params: Params) {
    this.lock.incr();
    const auth: AuthResponseObject = await this.http.get<AuthResponseObject>(`${serverURL}/oauth/callback`, { params }).toPromise();
    this.lock.decr();

    if (!auth) {
      return null;
    }

    this.user = auth.user;

    return auth.user;
  }
}
