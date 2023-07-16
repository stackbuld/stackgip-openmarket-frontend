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
import { WindowRefService } from '../../../shared/services/window.service';
import { AuthHelperService } from 'src/app/shared/services/auth-helper.service';

declare const FB: any;

// declare var gapi: any;

// facebook declarations
// declare var FB: any;
// declare var  statusChangeCallback: any;
// end of facebook decla
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hasError = false;
  passwordType: boolean;
  errors: any[] = [];
  errorMessage: string = '';
  loginForm: FormGroup;
  googleAuth: any;
  loading: false;
  message = '';
  tokenSubscription = new Subscription();
  decodedJwt;
  private _ngZone: any;
  private clientId = environment.googleClientId;
  window: Window;
  constructor(
    public authService: AuthService,
    // private socialAuthService: SocialAuthService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private jwtHelperService: JwtHelperService,
    windowRefService: WindowRefService,
    private authHelperService: AuthHelperService,
  ) {
    this.window = windowRefService.nativeWindow;

  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // @ts-ignore
    this.window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleGoogleAuth.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById('googleButton'),
        { size: 'large', width: 100 }
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  async handleGoogleAuth(response: CredentialResponse) {
    this.ngxService.startLoader('loader-01');
    await this.authService.LoginWithGoogle(response.credential).subscribe(
      (res) => {
        this.authHelperService.handleAuthResponse(res,'signin', 'google');
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
    FB.login(
      async (result: any) => {
        let token = result.authResponse.accessToken;
        let userId = result.authResponse.userID;
        this.ngxService.startLoader('loader-01');
        await this.authService.LoginWithFacebook(token, userId).subscribe(
          (res) => {
            this.authHelperService.handleAuthResponse(res,'signin', 'facebook');
          },
          (err) => {
            this.toast.error(err.error.message);
            this.ngxService.stopLoader('loader-01');
            this.ngxService.stopAll();
          }
        );
      },
      { scope: 'email' }
    );
  }

  login(): void {
    this.ngxService.startLoader('loader-01');
    this.authService.signIn(this.loginForm.value).subscribe(
      (res) => {
         this.authHelperService.handleAuthResponse(res,'signin', 'login');
        },
      (err) => {
        this.toast.error(err.error.message);
        this.ngxService.stopLoader('loader-01');
        this.ngxService.stopAll();
      }
    );
  }
}
