import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ForbiddenInterceptor implements HttpInterceptor {
  constructor(public router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((err): Observable<any> => {

          // redirect to main page if forbidden
          if (err instanceof HttpErrorResponse && err.status === 403) {
            this.router.navigate(['main']);
            return Observable.create(obs => obs.complete());
          }

          return throwError(err);
        }));
  }
}

export const ForbiddenInterceptorService = {
  provide: HTTP_INTERCEPTORS,
  useClass: ForbiddenInterceptor,
  multi: true
};
