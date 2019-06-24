import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { AuthService } from '@services/auth';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((err): Observable<any> => {

        // logout if unauthorized
        if (err instanceof HttpErrorResponse && err.status === 401) {
          // if it was trying to login, prevent the app to reboot
          const authorization = request.headers.get('authorization');
          if (authorization && authorization.startsWith('Basic ')) {
            return throwError(err);
          }
          if (request.url.endsWith('password-reset/validate')) {
            return throwError(err);
          }
          this.auth.logout(false);
        }

        return throwError(err);
      }));
  }
}

export const UnauthorizedInterceptorService = {
  provide: HTTP_INTERCEPTORS,
  useClass: UnauthorizedInterceptor,
  multi: true
};
