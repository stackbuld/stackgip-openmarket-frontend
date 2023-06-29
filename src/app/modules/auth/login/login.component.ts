import { Router } from '@angular/router';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

import { Component, OnInit, NgZone } from '@angular/core';


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
import { environment } from 'src/environments/environment';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';


declare const FB: any

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
  private _ngZone: any;
  private clientId = environment.googleClientId

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

          // @ts-ignore
          window.onGoogleLibraryLoad = () => {
            // @ts-ignore
            google.accounts.id.initialize({
              client_id: this.clientId,
              callback: this.handleGoogleAuth.bind(this),
              auto_select: false,
              cancel_on_tap_outside: true
            });
            // @ts-ignore
            google.accounts.id.renderButton(
            // @ts-ignore
            document.getElementById("buttonDiv"),
              { size: "large", width: 100} 
            );
            // @ts-ignore
            google.accounts.id.prompt((notification: PromptMomentNotification) => {});
          };
        }
    
        async handleGoogleAuth(response: CredentialResponse) {
          console.log("Response",response);
          this.ngxService.startLoader('loader-01');
          await this.authService.LoginWithGoogle(response.credential).subscribe(

            (res) => {
              this.ngxService.stopAll();
              if (res.data.canLogin === true) {
                if (res.data.user.preferredProfileType.toLowerCase() === 'seller') {
                  this.ngxService.stopLoader('loader-01');
                  this.authService.SetAuthLocalStorage(res);
                  if (
                    res.data.user.sellerApprovalStatus.toLowerCase() === 'approved' ||
                    res.data.user.sellerApprovalStatus.toLowerCase() === 'failed' ||
                    res.data.user.sellerApprovalStatus.toLowerCase() === 'pending'
                  ) {
                    this.toast.success("Login Successful");
                    this.router.navigate(['/seller/dashboard']);
                  } else {
                    this.toast.success("Login Successful");
                    this.router.navigate(['/']);
                  }
                } else {
                  console.log('helllllo')
                  this.ngxService.stopLoader('loader-01');
                  this.authService.SetAuthLocalStorage(res);
                  this.toast.success("Login Successful");
                  this.router.navigate(['/homepage']);
                }
              } 
              this.authService.SetAuthLocalStorage(res);
            },
            (err) => {
              this.toast.error(err.error.message);
              this.ngxService.stopLoader('loader-01');
              this.ngxService.stopAll();
            }
            );  
      }

  

  showPassword() {
    this.passwordType = !this.passwordType;
  }

  async facebookLogin() {
    FB.login(async (result:any) => {
      console.log("Result",result)
      let token = result.authResponse.accessToken;
      let userId = result.authResponse.userID;
      this.ngxService.startLoader('loader-01');
        await this.authService.LoginWithFacebook(token, userId ).subscribe(

 (res) => {
              this.ngxService.stopAll();
              if (res.data.canLogin === true) {
                if (res.data.user.preferredProfileType.toLowerCase() === 'seller') {
                  this.ngxService.stopLoader('loader-01');
                  this.authService.SetAuthLocalStorage(res);
                  if (
                    res.data.user.sellerApprovalStatus.toLowerCase() === 'approved' ||
                    res.data.user.sellerApprovalStatus.toLowerCase() === 'failed' ||
                    res.data.user.sellerApprovalStatus.toLowerCase() === 'pending'
                  ) {
                    this.toast.success("Login Successful");
                    this.router.navigate(['/seller/dashboard']);
                  } else {
                    this.toast.success("Login Successful");
                    this.router.navigate(['/']);
                  }
                } else {
                  console.log('helllllo')
                  this.ngxService.stopLoader('loader-01');
                  this.authService.SetAuthLocalStorage(res);
                  this.toast.success("Login Successful");
                  this.router.navigate(['/homepage']);
                }
              } 
              this.authService.SetAuthLocalStorage(res);
            },
            (err) => {
              this.toast.error(err.error.message);
              this.ngxService.stopLoader('loader-01');
              this.ngxService.stopAll();
            }

          );  
    }, { scope: 'email' });
    
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
            if (
              res.data.user.sellerApprovalStatus.toLowerCase() === 'approved' ||
              res.data.user.sellerApprovalStatus.toLowerCase() === 'failed' ||
              res.data.user.sellerApprovalStatus.toLowerCase() === 'pending'
            ) {
              this.toast.success("Login Successful");
              this.router.navigate(['/seller/dashboard']);
            } else {
              this.toast.success("Login Successful");
              this.router.navigate(['/']);
            }
          } else {
            this.ngxService.stopLoader('loader-01');
            this.authService.SetAuthLocalStorage(res);
            this.toast.success("Login Successful");
            this.router.navigate(['/']);
          }
        } else {
          this.ngxService.stopLoader('loader-01');
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
