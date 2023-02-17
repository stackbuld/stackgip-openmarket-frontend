import { WindowRefService } from './../../../shared/services/window.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'src/app/services/toastr.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RegisterModel } from 'src/app/models/register-model';
import { SignInModel } from 'src/app/models/signin-model';
import UIkit from 'uikit';
import { MustMatch } from 'src/app/helpers/control-validators';
// import {
//   FacebookLoginProvider,
//   GoogleLoginProvider,
//   SocialAuthService,
//   SocialUser,
// } from "@abacritt/angularx-social-login";
import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { JwtHelperService } from '../../../services/jwt-helper.service';
import { MDCTextField } from '@material/textfield';
// const textField = new MDCTextField(document.querySelector('.mdc-text-field'));

@Component({
  selector: 'app-siginup',
  templateUrl: './siginup.component.html',
  styleUrls: ['./siginup.component.css'],
})
export class SiginupComponent implements OnInit {
  tokenSubscription = new Subscription();
  decodedJwt;
  hasError = false;
  errors: any[];
  googleAuth: any;
  // user: SocialUser;
  message = '';
  errorMessage: string;
  window: Window;
  constructor(
    public authService: AuthService,
    // private socialAuthService: SocialAuthService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private jwtHelperService: JwtHelperService,
    windowRefService: WindowRefService
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
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: MustMatch('password', 'confirmPassword'),
      }
    );
    // {validator: this.ctrlValidator.MustMatch('password', 'confirmPassword')});

    // this.socialAuthService.authState.subscribe((user) => {
    //   this.user = user;
    // });
  }

  get f() {
    return this.registerForm.controls;
  }

  submit(): void {
    this.errors = [];
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    const data: RegisterModel = {
      firstName: this.registerForm.get('firstname').value,
      lastName: this.registerForm.get('lastname').value,
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value,
      confirmPassword: this.registerForm.get('confirmPassword').value,
      // profileImageUrl: "",
    } as RegisterModel;
    this.ngxService.startLoader('loader-01');

    this.authService.register(data).subscribe(
      (d) => {
        // const signinData = {
        //   email: data.email,
        //   password: data.password,
        // } as SignInModel;
        // this.login(signinData);
        this.ngxService.stopLoader('loader-01');
        this.message = d.message;
        this.toast.success(d.message, 'notification');
        this.router.navigateByUrl('confirm-email')
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
            this.router.navigate(['/confirm-email']);
          } else {
            this.window.location.reload();
          }
        } else {
          if (a.data.isNotAllowed) {
            this.router.navigate(['/confirm-email']);
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
}
