import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfigService } from '@services/config';

@Injectable()
export class SetupInterceptor implements HttpInterceptor {
  constructor(public router: Router, private config: ConfigService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((err): Observable<any> => {

        if (err instanceof HttpErrorResponse && err.status === 418) {
          this.config.isConfigured = false;
          this.router.navigate(['setup']);
          return new Observable(obs => obs.complete());
        }

        return throwError(err);
      }));
  }
}

export const SetupInterceptorService = {
  provide: HTTP_INTERCEPTORS,
  useClass: SetupInterceptor,
  multi: true
};
