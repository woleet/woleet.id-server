import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from './config';

@Injectable()
export class APIKeyService {

  constructor(private http: HttpClient) { }

  getById(apiKeyId: string) {
    return this.http.get<ApiAPIKeyObject>(`${serverURL}/api-key/${apiKeyId}`).toPromise()
  }

  getAll(): Promise<ApiAPIKeyObject[]> {
    return this.http.get<ApiAPIKeyObject[]>(`${serverURL}/api-key/list`).toPromise()
  }

  create(apiKey: ApiPostAPIKeyObject) {
    return this.http.post<ApiAPIKeyObject>(`${serverURL}/api-key`, apiKey).toPromise()
  }

  edit(apiKeyId: string, apiKey: ApiPutAPIKeyObject) {
    return this.http.put<ApiAPIKeyObject[]>(`${serverURL}/api-key/${apiKeyId}/key/list`, apiKey).toPromise()
  }

  delete(apiKeyId: string) {
    return this.http.delete<ApiAPIKeyObject>(`${serverURL}/api-key/${apiKeyId}`).toPromise()
  }

}
