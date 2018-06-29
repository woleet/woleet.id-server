import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const serverURL = 'http://localhost:3000'

@Injectable()
export class InfoService {

  constructor(private http: HttpClient) { }

  getInfo() {
    return this.http.get<ApiUserDTOObject>(`${serverURL}/info/`).toPromise()
  }

}
