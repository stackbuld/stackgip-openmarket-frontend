import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WindowRefService } from '../../services/window.service';
import uikit from 'uikit';
import { AuthService } from 'src/app/services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'src/app/services/toastr.service';
import { NavigationEnd, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SignInModel } from 'src/app/models/signin-model';
import { Subscription, filter } from 'rxjs';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { environment } from 'src/environments/environment';
import { CountryService } from 'src/app/services/country/country.service';
import { CountryInfo } from 'src/app/models/country.model';
import { countryCodes } from 'src/app/data/countryCodes';
declare const FB: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  tokenSubscription = new Subscription();
  decodedJwt;
  currentUrl: string = '';
  hasError = false;
  passwordType: boolean;
  errors: any[];
  googleAuth: any;
  message = '';
  countryInfo: CountryInfo[];
  errorMessage: string;
  window: Window;
  foods = [
    { value: '0', label: 'Steak' },
    { value: '1', label: 'Pizza' },
    { value: '2', label: 'Tacos' },
  ];
  FB: any;
  private clientId = environment.googleClientId;
  isTermsAndConditionsAgreed: FormControl = new FormControl(true);
  termsAndConditions: string = environment.buyerTermsAndConditionsUrl;
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    windowRefService: WindowRefService,
    private countryService: CountryService,
  ) {
    this.window = windowRefService.nativeWindow;
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => (this.currentUrl = event.url));
  }
  registerForm: FormGroup;

  ngOnInit(): void {
    this.hasError = false;
    this.errors = [];
    this.errorMessage = '';
    this.message = '';

    this.countryService.getCountry().subscribe({
      next: (data) => {
        this.countryInfo = data;
      },
    });

    this.registerForm = this.fb.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      countryCode: ['+234'],
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          this.patternValidator(new RegExp('(?=.*[0-9])'), {
            requiresDigit: true,
          }),
          this.patternValidator(new RegExp('(?=.*[A-Z])'), {
            requiresUppercase: true,
          }),
          this.patternValidator(new RegExp('(?=.*[a-z])'), {
            requiresLowercase: true,
          }),
          this.patternValidator(new RegExp('(?=.*[$@^!%*?&])'), {
            requiresSpecialChars: true,
          }),
        ]),
      ],

      phoneNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    });

    // @ts-ignore
    this.window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleGoogleSignup.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById('buttonDiv'),
        { theme: 'outline', size: 'large', width: 100, text: 'signup_with' },
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  changeOption(e: any) {
    this.registerForm?.patchValue({ countryCodes: e.target.value });
  }
  async handleGoogleSignup(response: CredentialResponse) {
    this.ngxService.startLoader('loader-01');
    await this.authService.LoginWithGoogle(response.credential).subscribe({
      next: (res) => {
        this.authService.handleAuthResponse(res, 'signup', 'google');
      },
      error: (err) => {
        this.toast.error(err.error.message);
        this.ngxService.stopLoader('loader-01');
        this.ngxService.stopAll();
      },
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  get passwordValid() {
    return this.registerForm.controls['password'].errors === null;
  }

  get requiredValid() {
    return !this.registerForm.controls['password'].hasError('required');
  }

  get minLengthValid() {
    return !this.registerForm.controls['password'].hasError('minlength');
  }

  get requiresDigitValid() {
    return !this.registerForm.controls['password'].hasError('requiresDigit');
  }

  get requiresUppercaseValid() {
    return !this.registerForm.controls['password'].hasError(
      'requiresUppercase',
    );
  }

  get requiresLowercaseValid() {
    return !this.registerForm.controls['password'].hasError(
      'requiresLowercase',
    );
  }

  get requiresSpecialCharsValid() {
    return !this.registerForm.controls['password'].hasError(
      'requiresSpecialChars',
    );
  }

  showPassword() {
    this.passwordType = !this.passwordType;
  }

  submit(): void {
    this.errors = [];
    this.errorMessage = '';

    if (!this.isTermsAndConditionsAgreed.value) {
      this.toast.warining('Terms and conditions must be accepted!');
      return;
    }
    if (this.registerForm.invalid) {
      return;
    }
    const payload = {
      firstName: this.registerForm.get('firstname').value,
      lastName: this.registerForm.get('lastname').value,
      email: this.registerForm.get('email').value,
      phoneNumber:
        this.registerForm.get('countryCode').value.toString() +
        this.registerForm.get('phoneNumber').value.toString(),
      password: this.registerForm.get('password').value,
    };
    this.ngxService.startLoader('loader-01');

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.authService.handleAuthResponse(res, 'signup', 'register');

        this.hasError = false;
      },
      error: (err) => {
        this.errors = [];
        this.ngxService.stopLoader('loader-01');
        this.hasError = true;
        if (err.status == 0) {
          this.errors.push('something went wrong please try again later');
          this.toast.error(
            'something went wrong please try again later',
            'notification',
          );
        } else {
          this.errors.push(...err.error.message.split(','));
        }
        this.toast.error(err.error.message, 'notification');
      },
    });
  }

  async facebookSignup() {
    FB.login(
      async (result: any) => {
        let token = result.authResponse.accessToken;
        let userId = result.authResponse.userID;
        this.ngxService.startLoader('loader-01');
        await this.authService.LoginWithFacebook(token, userId).subscribe(
          (res) => {
            this.authService.handleAuthResponse(res, 'signup', 'facebook');
          },
          (err) => {
            this.toast.error(err.error.message);
            this.ngxService.stopLoader('loader-01');
            this.ngxService.stopAll();
          },
        );
      },
      { scope: 'email' },
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
      },
    );
  }

  toggleSignupModal() {
    this.currentUrl.includes('seller-form')
      ? this.authService.showSharedLoginModal()
      : this.router.navigate(['/auth/login']);
  }

  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      return valid ? null : error;
    };
  }
}
