import { Component, OnInit } from '@angular/core';
import { WindowRefService } from '../../../shared/services/window.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'src/app/services/toastr.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SignInModel } from 'src/app/models/signin-model';
import { Subscription } from 'rxjs';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { environment } from 'src/environments/environment';
declare const FB: any


@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss']
})
export class SignupModalComponent implements OnInit {
  tokenSubscription = new Subscription();
  decodedJwt;
  hasError = false;
  passwordType: boolean
  errors: any[];
  googleAuth: any;
  message = '';
  errorMessage: string;
  window: Window;
  FB: any
  private clientId = environment.googleClientId;
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    windowRefService: WindowRefService,
  ) {
    this.window = windowRefService.nativeWindow;
  }
  registerForm: FormGroup;

  ngOnInit(): void {
    this.hasError = false;
    this.errors = [];
    this.errorMessage = '';
    this.message = '';
    this.registerForm = this.fb.group(
      {
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)]],
        phoneNumber: ['', [Validators.required, Validators.pattern('/((^090)([0-9]{8,}$))|((^070)([0-9]{8,}$))|((^090)([0-9]{8,}$))||((^081)([0-9]{8,}$))|((^080)([0-9]{8,}$))|((^081)([0-9]{8,}$))/'), Validators.minLength(11), Validators.maxLength(11)]],
      },
    );
     // @ts-ignore
    this.window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleGoogleSignup.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });
      // @ts-ignore
      google.accounts.id.renderButton(
      // @ts-ignore
      document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", width: 100, text: "signup_with"}
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  };

  async handleGoogleSignup(response: CredentialResponse) {
    this.ngxService.startLoader('loader-01');
    await this.authService.LoginWithGoogle(response.credential).subscribe(

      (res) => {
        this.authService.handleAuthResponse(res,'signup', 'google');
      },
      (err) => {
        this.toast.error(err.error.message);
        this.ngxService.stopLoader('loader-01');
        this.ngxService.stopAll();
      }
      );
}

get f() {
  return this.registerForm.controls;
}

showPassword() {
  this.passwordType = !this.passwordType;
}

submit(): void {
  this.errors = [];
  this.errorMessage = '';

  if (this.registerForm.invalid) {
    return;
  }
  const payload = {
    firstName: this.registerForm.get('firstname').value,
    lastName: this.registerForm.get('lastname').value,
    email: this.registerForm.get('email').value,
    phoneNumber: this.registerForm.get('phoneNumber').value,
    password: this.registerForm.get('password').value,
  }
  this.ngxService.startLoader('loader-01');

  this.authService.register(payload).subscribe(
    (d) => {
      this.ngxService.stopLoader('loader-01');
      this.message = d.message;
      this.toast.success(d.message, 'notification');
      this.router.navigateByUrl('auth/confirm-email')
      this.hasError = false;
    },
    (err) => {
      this.errors = [];
      this.ngxService.stopLoader('loader-01');
      this.hasError = true;
      if (err.status == 0) {
        this.errors.push('something went wrong please try again later');
        this.toast.error(
          'something went wrong please try again later',
          'notification'
        );
      } else {
        this.errors.push(...err.error.message.split(','));
      }
      this.toast.error(err.error.message, 'notification');
    }
  );
}

async facebookSignup() {
  FB.login(async (result:any) => {
    console.log("Result",result)
    let token = result.authResponse.accessToken;
    let userId = result.authResponse.userID;
    this.ngxService.startLoader('loader-01');
      await this.authService.LoginWithFacebook(token, userId ).subscribe(

(res) => {
this.authService.handleAuthResponse(res,'signup', 'facebook');            },
          (err) => {
            this.toast.error(err.error.message);
            this.ngxService.stopLoader('loader-01');
            this.ngxService.stopAll();
          }
        );
  }, { scope: 'email' });

}

login(signInModel: SignInModel) {
  this.ngxService.startLoader('loader-01');

  this.ngxService.startLoader('loader-01');

  this.authService.signIn(signInModel).subscribe(
    (a) => {
      this.ngxService.stopLoader('loader-01');
      this.authService.SetAuthLocalStorage(a);
      this.authService.logoutAndRedirectOnTokenExpiration(a.data.auth_token);
      if (a.status == 'success') {
        this.message = 'login successful';
        this.hasError = false;
        this.toast.success('login successful', 'notification');
        if (!a.data.canLogin) {
          this.router.navigate(['/auth/confirm-email']);
        } else {
          this.window.location.reload();
        }
      } else {
        if (a.data.isNotAllowed) {
          this.router.navigate(['/auth/confirm-email']);
        }
      }
    },
    (err) => {
      this.errors = [];
      if (err.status === 0) {
        this.errors.push('something went wrong please try');
      } else {
        this.errors.push(...err.error.message.split(','));
      }
      this.ngxService.stopLoader('loader-01');
    }
  );
}

  toggleSignupModal() {

    this.authService.showSharedSocialModal();
  }
}
