import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from './config';
import { Observable } from 'rxjs';

@Injectable()
export class OnboardingService {

  constructor(private http: HttpClient) { }

  getUserByOnboardingId(onboardingId: string): Observable<ApiUserObject> {
    return this.http.get<ApiUserObject>(`${serverURL}/external-key/enrolment/${onboardingId}/`);
  }

  createTCUSignatureRequest(onboardingId: string, email: string): Observable<Object> {
    return this.http.post<boolean>
      (`${serverURL}/external-key/enrolment/${onboardingId}/create-signature-request`, { email: email });
  }

}
