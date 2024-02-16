import { ErrorService } from './../services/error.service';
import { ToastrService } from 'src/app/services/toastr.service';

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
declare var UIkit: any;
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private toast: ToastrService,
    private errorService: ErrorService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
  ) {}
  message = '';
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        this.ngxService.stopAll();
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
          } else {
            switch (error.status) {
              case 401:
                this.toast.info('Session expired, please login to continue');
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate(['/auth']);
                break;

              case 403: //forbidden
                this.toast.info('You are not authorize to access this content');
                break;
              default:
                if (!navigator.onLine) {
                  this.message = this.errorService.getServerErrorMessage(error);
                  this.toast.error('No internet connection');
                  break;
                }
            }
          }
        } else {
          //client side error
          this.message = this.errorService.getClientErrorMessage(error);
          this.toast.error(this.message);
        }
        this.ngxService.stopAll();
        return throwError(() => new Error(error));
      }),
    );
  }
}
