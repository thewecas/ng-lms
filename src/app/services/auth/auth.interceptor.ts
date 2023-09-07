import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const idToken = this.authService.getIdToken();

    if (!!idToken) {
      const modifiedReq = request.clone({
        params: new HttpParams().set('auth', idToken),
        headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')

      });
      console.log("Request Tapped & Modified : \n", modifiedReq);
      return next.handle(modifiedReq);
    }
    else
      return next.handle(request);






  }
}
