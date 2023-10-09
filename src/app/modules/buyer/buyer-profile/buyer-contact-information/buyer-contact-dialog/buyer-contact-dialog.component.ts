import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/IUserModel';
import { CountryInfo } from 'src/app/models/country.model';
import { AuthService } from 'src/app/services/auth.service';
import { CountryService } from 'src/app/services/country/country.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-buyer-contact-dialog',
  templateUrl: './buyer-contact-dialog.component.html',
  styleUrls: ['./buyer-contact-dialog.component.scss'],
})
export class BuyerContactDialogComponent {
  countryInfo: CountryInfo[];
  contactForm: FormGroup;
  isEditingSub$: Subscription;
  isEditing: boolean;
  isVerifying: boolean;
  isVerified: boolean;
  userId: string;
  user: IUser;
  isFetching: boolean = false;
  isSubmitting: boolean = false;

  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '70px',
      height: '70px',
      borderRadius: '8px',
      boxShadow: '0 0 3px #ccc',
    },
    inputClass: 'otp-c-input',
  };

  config2 = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '33px',
      height: '33px',
      borderRadius: '8px',
      boxShadow: '0 0 3px #ccc',
    },
    inputClass: 'otp-c-input',
  };

  config3 = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '33px',
      height: '33px',
      borderRadius: '8px',
      boxShadow: '0 0 3px #ccc',
    },
    inputClass: 'otp-c-input',
  };
  phoneNumber: string;
  otpInput: FormControl;
  isResending: boolean = false;
  resendTimer: number = 29;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA)
    private data: { editing: boolean; countries: CountryInfo[] },
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.updateUser();

    this.contactForm = new FormGroup({
      countryCode: new FormControl('+234'),
      phoneNumber: new FormControl(null, Validators.required),
    });

    this.isEditing = this.data.editing;
    this.countryInfo = this.data.countries;

    // this.isEditingSub$ = this.userService.isEditingUserInfo.subscribe({
    //   next: (status) => {
    //     this.isEditing = status;
    //   },
    // });

    this.otpInput = new FormControl<string>(null, Validators.required);
  }

  updateUser() {
    this.userId = this.authService.getLoggedInUser().id;

    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user.data;
        this.isFetching = false;
      },
      error: (err) => {
        this.isFetching = false;
      },
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  changeOption(e: any) {
    this.contactForm.patchValue({ countryCodes: e.target.value });
  }

  onEdit() {
    this.isEditing = true;
    this.userService.isEditingUserInfo.next(true);
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    let phoneNumber = this.contactForm.get('phoneNumber').value.toString();

    this.contactForm.get('phoneNumber').value.toString();

    phoneNumber = phoneNumber.replace(/^0+/, '');

    const formattedPhoneNumber =
      this.contactForm.get('countryCode').value.toString() + phoneNumber;

    this.phoneNumber = formattedPhoneNumber;

    this.sendOtp();
  }

  onResendOtp() {
    this.sendOtp();
  }

  sendOtp() {
    this.authService.sendPersonalPhoneOTP().subscribe({
      next: (data) => {
        this.isVerifying = true;
        this.isEditing = false;
        this.isSubmitting = false;

        let timer = 29;

        setInterval(() => {
          timer = timer - 1;
          if (timer >= 0) {
            this.resendTimer = timer;
          }
        }, 1000);
      },
      error: (err) => {
        this.isSubmitting = false;
      },
    });
  }

  onVerify() {
    this.authService
      .verifyPersonalPhoneNumber({
        phoneNumber: this.phoneNumber,
        otp: this.otpInput.value,
      })
      .subscribe({
        next: (data) => {
          this.isVerified = true;
          this.isVerifying = false;
        },
        error: (err) => {},
      });
  }

  onContinue() {
    this.dialog.closeAll();
    this.updateUser();
  }
}
