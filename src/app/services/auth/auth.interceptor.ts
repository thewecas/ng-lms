import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const idToken = this.authService.getIdToken();

    if (!!idToken && !request.url.includes('googleapis.com')) {
      const modifiedReq = request.clone({
        params: new HttpParams().set('auth', idToken),
        headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*'),
      });
      return next.handle(modifiedReq);
    } else return next.handle(request);
  }
}
