import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from './config';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
  }

  getById(userId: string): Promise<ApiUserObject> {
    return this.http.get<ApiUserObject>(`${serverURL}/user/${userId}/`).toPromise();
  }

  async getAll(query?: object, offset?: number, limit?: number): Promise<ApiUserObject[]> {
    const params = new URLSearchParams();
    for (const key of Object.keys(query)) {
      if (query[key]) {
        params.set(key, query[key]);
      }
    }
    if (offset) {
      params.set('offset', offset.toString());
    }
    if (limit) {
      params.set('limit', limit.toString());
    }
    return this.http.get<ApiUserObject[]>(`${serverURL}/user/list?${params.toString()}`).toPromise();
  }

  async create(user: ApiPostUserObject): Promise<ApiUserObject> {
    return this.http.post<ApiUserObject>(`${serverURL}/user/`, user).toPromise();
  }

  async update(userId: string, userAttrs: ApiPutUserObject): Promise<ApiUserObject> {
    return this.http.put<ApiUserObject>(`${serverURL}/user/${userId}/`, userAttrs).toPromise();
  }

  async delete(keyId: string): Promise<any> {
    return this.http.delete(`${serverURL}/user/${keyId}`).toPromise();
  }

  async resetPassword(email: string) {
    return this.http.post<Boolean>(`${serverURL}/password-reset`, { email }).toPromise();
  }

  async keyEnrollment(enrollment: ApiPostEnrollmentObject) {
    return this.http.post<Boolean>(`${serverURL}/enrollment`, enrollment).toPromise();
  }

  async validate(email: string, password: string, token: string) {
    return this.http.post<Boolean>(`${serverURL}/password-reset/validate`, { email, password, token }).toPromise();
  }
}
