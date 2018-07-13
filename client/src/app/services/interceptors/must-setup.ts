import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfigService } from '@services/config';

@Injectable()
export class SetupInterceptor implements HttpInterceptor {
  constructor(public router: Router, private config: ConfigService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((err): Observable<any> => {
        console.log('Status', err.status);
        if (err instanceof HttpErrorResponse && err.status === 418) {
          this.config.isConfigured = false;
          this.router.navigate(['setup']);
          return of(false);
        }
        return next.handle(request);
      }))
  }
}

export const SetupInterceptorService = {
  provide: HTTP_INTERCEPTORS,
  useClass: SetupInterceptor,
  multi: true
};
