import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';

export const serverURL = environment.serverURL;

@Injectable()
export class ConfigService {

  public isConfigured = true;

  constructor(private http: HttpClient, private router: Router) { }

  getServerBaseURL() {
    return serverURL;
  }

}
