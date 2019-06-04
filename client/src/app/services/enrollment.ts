import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from './config';
import { Observable } from 'rxjs';

@Injectable()
export class EnrollmentService {

  constructor(private http: HttpClient) { }

  getUserByEnrollmentId(enrollmentId: string): Observable<ApiUserObject> {
    return this.http.get<ApiUserObject>(`${serverURL}/enrollment/${enrollmentId}/`);
  }

  createTCUSignatureRequest(enrollmentId: string, email: string): Observable<Object> {
    return this.http.post<boolean>
      (`${serverURL}/enrollment/${enrollmentId}/create-signature-request`, { email: email });
  }
}
