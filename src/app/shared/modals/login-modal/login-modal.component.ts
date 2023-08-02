import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';
import { JwtHelperService } from '../../../services/jwt-helper.service';
import { environment } from 'src/environments/environment';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { WindowRefService } from '../../../shared/services/window.service';

declare const FB: any;

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit{

  hasError = false;
  passwordType: boolean;
  errors: any[] = [];
  errorMessage: string = '';
  loginForm: FormGroup;
  googleAuth: any;
  loading: false;
  message = '';
  isLoginModal = true;
  tokenSubscription = new Subscription();
  decodedJwt;
  private _ngZone: any;
  private clientId = environment.googleClientId;
  window: Window;
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private jwtHelperService: JwtHelperService,
    windowRefService: WindowRefService,
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
        document.getElementById('buttonDiv'),
        { size: 'large', width: 100, theme: 'filled_black' }
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  async handleGoogleAuth(response: CredentialResponse) {
    this.ngxService.startLoader('loader-01');
    await this.authService.LoginWithGoogle(response.credential).subscribe(
      (res) => {
        this.authService.handleAuthResponse(res,'signin', 'google');
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
            this.authService.handleAuthResponse(res,'signin', 'facebook');
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

  hideForgotModal = () => {
    this.authService.hideSharedLoginModal();
  }

  login(): void {
    this.ngxService.startLoader('loader-01');
    this.authService.signIn(this.loginForm.value).subscribe(
      (res) => {
         this.authService.handleAuthResponse(res,'signin', 'login');
        },
      (err) => {
        this.toast.error(err.error.message);
        this.ngxService.stopLoader('loader-01');
        this.ngxService.stopAll();
      }
    );
  }
  toggleSignupModal = () => {
    this.authService.showSharedSignupModal();
  }

}
