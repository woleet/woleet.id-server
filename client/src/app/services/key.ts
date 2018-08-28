import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from './config';

@Injectable()
export class KeyService {

  constructor(private http: HttpClient) { }

  getById(keyId: string) {
    return this.http.get<ApiTokenObject>(`${serverURL}/key/${keyId}`).toPromise();
  }

  getByUser(userId: string): Promise<ApiTokenObject[]> {
    return this.http.get<ApiTokenObject[]>(`${serverURL}/user/${userId}/key/list`).toPromise();
  }

  getAll(): Promise<ApiTokenObject[]> {
    return this.http.get<ApiTokenObject[]>(`${serverURL}/key/list`).toPromise();
  }

  create(userId: string, key: ApiPostKeyObject) {
    return this.http.post<ApiTokenObject>(`${serverURL}/user/${userId}/key`, key).toPromise();
  }

  update(keyId: string, key: ApiPutKeyObject) {
    return this.http.put<ApiTokenObject>(`${serverURL}/key/${keyId}`, key).toPromise();
  }

  delete(keyId: string) {
    return this.http.delete<ApiTokenObject>(`${serverURL}/key/${keyId}`).toPromise();
  }

}
