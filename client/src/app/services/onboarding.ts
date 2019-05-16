import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from './config';

@Injectable()
export class OnboardingService {

  constructor(private http: HttpClient) { }

  getUserByOnboardingId(userId: string): Promise<ApiUserObject> {
    return this.http.get<ApiUserObject>(`${serverURL}/external-key/enrolment/${userId}/`).toPromise();
  }

  createTCUSignatureRequest(email: string) {
    return this.http.post<boolean>(`${serverURL}/external-key/enrolment/finalize`, { email: email }).toPromise();
  }

}
