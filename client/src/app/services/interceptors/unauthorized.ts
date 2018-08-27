import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { AuthService } from '@services/auth';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((err): Observable<any> => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.auth.logout();
          return of(false);
        }
        return next.handle(request);
      }));
  }
}

export const UnauthorizedInterceptorService = {
  provide: HTTP_INTERCEPTORS,
  useClass: UnauthorizedInterceptor,
  multi: true
};
