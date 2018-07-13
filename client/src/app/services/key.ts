import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from './config';

@Injectable()
export class KeyService {

  constructor(private http: HttpClient) { }

  getById(keyId: string) {
    return this.http.get<ApiKeyObject>(`${serverURL}/key/${keyId}`).toPromise()
  }

  getByUser(userId: string): Promise<ApiKeyObject[]> {
    return this.http.get<ApiKeyObject[]>(`${serverURL}/user/${userId}/key/list`).toPromise()
  }

  getAll(): Promise<ApiKeyObject[]> {
    return this.http.get<ApiKeyObject[]>(`${serverURL}/key/list`).toPromise()
  }

  add(userId: string, key: ApiPostKeyObject) {
    return this.http.post<ApiKeyObject[]>(`${serverURL}/user/${userId}/key`, key).toPromise()
  }

  edit(keyId: string, key: ApiPutKeyObject) {
    return this.http.put<ApiKeyObject[]>(`${serverURL}/key/${keyId}/key/list`, key).toPromise()
  }

  delete(keyId: string) {
    return this.http.delete<ApiKeyObject>(`${serverURL}/key/${keyId}`).toPromise()
  }

}
