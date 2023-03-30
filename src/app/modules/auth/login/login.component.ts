import { Router } from '@angular/router';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

import { Component, OnInit } from '@angular/core';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SignInModel } from 'src/app/models/signin-model';
// import { UIkit } from "uikit";
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
// import {
//   FacebookLoginProvider,
//   GoogleLoginProvider,
//   SocialAuthService,
// } from "@abacritt/angularx-social-login";
import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { JwtHelperService } from '../../../services/jwt-helper.service';

// declare var gapi: any;

// facebook declarations
// declare var FB: any;
// declare var  statusChangeCallback: any;
// end of facebook decla
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  hasError = false;
  passwordType:  boolean
  errors: any[] = [];
  errorMessage: string = '';
  loginForm: FormGroup;
  googleAuth: any;
  loading: false;
  message = '';
  tokenSubscription = new Subscription();
  decodedJwt;
  constructor(
    public authService: AuthService,
    // private socialAuthService: SocialAuthService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private jwtHelperService: JwtHelperService
  ) { }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  showPassword() {
    this.passwordType = !this.passwordType;
  }

  login(): void {
    this.ngxService.startLoader('loader-01');
    this.authService.signIn(this.loginForm.value).subscribe(
      (res) => {
        this.ngxService.stopAll();
        // if (res.status == 'success') {

        if (res.data.canLogin === true) {
          if (res.data.user.preferredProfileType.toLowerCase() === 'seller') {
            this.ngxService.stopLoader('loader-01');
            this.authService.SetAuthLocalStorage(res);
            this.toast.success(res.message);
            if (
              res.data.user.sellerApprovalStatus.toLowerCase() === 'approved' ||
              res.data.user.sellerApprovalStatus.toLowerCase() === 'failed' ||
              res.data.user.sellerApprovalStatus.toLowerCase() === 'pending'
            ) {
              this.router.navigate(['/seller/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.ngxService.stopLoader('loader-01');
            this.authService.SetAuthLocalStorage(res);
            this.toast.success(res.message);
            this.router.navigate(['/']);
          }
        } else {
          console.log('Please confirm your email address');
          this.toast.error('Please confirm your email address');
          this.router.navigate(['/auth/confirm-email']);
        }
        this.authService.SetAuthLocalStorage(res);

        //}
        //  else {
        //   this.ngxService.stopLoader('loader-01');
        //   this.toast.error(res.message);
        // }
      },
      (err) => {
        this.toast.error(err.error.message);
        this.ngxService.stopLoader('loader-01');
        this.ngxService.stopAll();
      }
    );
  }
}
