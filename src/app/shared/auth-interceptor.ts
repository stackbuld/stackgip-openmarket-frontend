import { ApiAppUrlService } from './../services/api-app-url.service';

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private api: ApiAppUrlService, private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = this.authService.getUserToken();
    let authReq = req.clone();
    const identityUrl = authReq.url.search(this.api.baseApiUrl);
    const ecommerceUrl = authReq.url.search(this.api.ecommerceBaseUrl);
    const walletUrl = authReq.url.search(this.api.walletBaseUrl);
    if (identityUrl >= 0 || ecommerceUrl >= 0 || walletUrl >= 0) {
      if (token) {
        authReq = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + token),
        });
      }
    }
    const isExternalApiRequest = req.headers.get('x-external-api-request');
    if (isExternalApiRequest) {
      let headers = req.headers;

      if (isExternalApiRequest) {
        headers = headers.delete('x-external-api-request');
      }

      const modifiedReq = req.clone({ headers });
      return next.handle(modifiedReq);
    }
    return next.handle(authReq);
  }
}
