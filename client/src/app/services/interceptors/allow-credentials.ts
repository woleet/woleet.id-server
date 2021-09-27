import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';

// https://github.com/angular/angular/issues/5254

@Injectable()
export class AllowCredentialsInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request.clone());
  }
}

export const AllowCredentialsInterceptorService = {
  provide: HTTP_INTERCEPTORS,
  useClass: AllowCredentialsInterceptor,
  multi: true
};
