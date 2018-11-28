import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as log from 'loglevel';

import { ErrorService } from '@services/error';

export function switchNetworkError(err) {
  switch (err.status) {
    case 0:
      return 'network';
    case 502:
      return 'no-server';
    default:
      return 'server-error';
  }
}

@Injectable()
export class NetworkErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private errorService: ErrorService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((err): Observable<any> => {

        if (err instanceof HttpErrorResponse && err.status === 0 || err.status > 499) {
          log.error('Network error', err);
          this.errorService.setError(switchNetworkError(err), err);
          this.router.navigate(['error']);
          return Observable.create(obs => obs.complete());
        }

        return throwError(err);
      }));
  }
}

export const NetworkErrorInterceptorService = {
  provide: HTTP_INTERCEPTORS,
  useClass: NetworkErrorInterceptor,
  multi: true
};
