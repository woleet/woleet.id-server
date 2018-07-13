import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export const serverURL = 'http://localhost:3000';

@Injectable()
export class ConfigService {

  public isConfigured = true;

  constructor(private http: HttpClient, private router: Router) { }

  getServerBaseURL() {
    return serverURL;
  }

}
