import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from './config';

@Injectable()
export class InfoService {

  constructor(private http: HttpClient) { }

  getInfo() {
    return this.http.get<ApiUserDTOObject>(`${serverURL}/info/`).toPromise()
  }

}
