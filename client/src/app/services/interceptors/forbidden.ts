import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ForbiddenInterceptor implements HttpInterceptor {
  constructor(public router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((err): Observable<any> => {
        console.log('Status', err.status);
        if (err instanceof HttpErrorResponse && err.status === 403) {
          this.router.navigate(['main'])
          return of(false);
        }
        return next.handle(request);
      }))
  }
}

export const ForbiddenInterceptorService = {
  provide: HTTP_INTERCEPTORS,
  useClass: ForbiddenInterceptor,
  multi: true
};
