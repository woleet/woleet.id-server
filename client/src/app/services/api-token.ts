import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from './config';

@Injectable()
export class APITokenService {

  constructor(private http: HttpClient) { }

  getById(apiTokenId: string) {
    return this.http.get<ApiAPITokenObject>(`${serverURL}/api-token/${apiTokenId}`).toPromise();
  }

  getAll(): Promise<ApiAPITokenObject[]> {
    return this.http.get<ApiAPITokenObject[]>(`${serverURL}/api-token/list`).toPromise();
  }

  create(apiToken: ApiPostAPITokenObject) {
    return this.http.post<ApiAPITokenObject>(`${serverURL}/api-token`, apiToken).toPromise();
  }

  update(apiTokenId: string, apiToken: ApiPutAPITokenObject) {
    return this.http.put<ApiAPITokenObject>(`${serverURL}/api-token/${apiTokenId}`, apiToken).toPromise();
  }

  delete(apiTokenId: string) {
    return this.http.delete<ApiAPITokenObject>(`${serverURL}/api-token/${apiTokenId}`).toPromise();
  }

}
