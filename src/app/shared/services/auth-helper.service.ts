import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class AuthHelperService {

  constructor(
    private ngxService: NgxUiLoaderService,
    private toast: ToastrService,
    private router: Router,
    public authService: AuthService,


  ) { }


  async handleAuthResponse(res: any, accessType: string, authType: string) {
    this.ngxService.stopAll();
    if (accessType === 'signin' && authType === 'login' && res.data.canLogin === false) {
      this.ngxService.stopLoader('loader-01');
          this.toast.error('Please confirm your email address');
          this.router.navigate(['/auth/confirm-email']);
          return;
    }
    if (res.data.canLogin === true) {
      if (res.data.user.preferredProfileType.toLowerCase() === 'seller') {
        this.ngxService.stopLoader('loader-01');
        this.authService.SetAuthLocalStorage(res);
        if (
          res.data.user.sellerApprovalStatus.toLowerCase() === 'approved' ||
          res.data.user.sellerApprovalStatus.toLowerCase() === 'failed' ||
          res.data.user.sellerApprovalStatus.toLowerCase() === 'pending'
        ) {
          this.toast.success(`${accessType === 'signin'? 'Login': 'Signup'} Successful`);
          this.router.navigate(['/seller/dashboard']);
        } else {
          this.toast.success(`${accessType === 'signin'? 'Login': 'Signup'} Successful`);
          this.router.navigate(['/']);
        }
      } else {
        this.ngxService.stopLoader('loader-01');
        this.authService.SetAuthLocalStorage(res);
        this.toast.success(`${accessType === 'signin'? 'Login': 'Signup'} Successful`);
        authType === 'login'? this.router.navigate(['/']): this.router.navigate(['/homepage'])
      }
    }
   
    this.authService.SetAuthLocalStorage(res);
  }
}
