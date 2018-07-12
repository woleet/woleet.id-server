import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const serverURL = 'http://localhost:3000'

@Injectable()
export class KeyService {

  constructor(private http: HttpClient) { }

  getById(keyId: string) {

  }

  getByUser(userId: string): Promise<ApiKeyObject[]> {
    return this.http.get<ApiKeyObject[]>(`${serverURL}/user/${userId}/key/list`).toPromise()
  }

  getAll() {

  }

  add(userId: string, key: ApiKeyObject) {

  }

  edit(keyId: string, key: ApiKeyObject) {

  }

  delete(keyId: string) {
    return this.http.delete<ApiKeyObject[]>(`${serverURL}/key/${keyId}`).toPromise()
  }

}
