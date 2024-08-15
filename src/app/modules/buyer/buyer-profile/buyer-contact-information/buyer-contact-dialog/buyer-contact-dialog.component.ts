import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'src/app/services/toastr.service';

import { IUser } from 'src/app/models/IUserModel';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-buyer-contact-dialog',
  templateUrl: './buyer-contact-dialog.component.html',
  styleUrls: ['./buyer-contact-dialog.component.scss'],
})
export class BuyerContactDialogComponent {
  contactForm: FormGroup;
  isVerifying: boolean = true;
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
  otpType: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA)
    private data: { type: string; payload: any },
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.updateUser();

    this.otpType = this.data.type;
    this.phoneNumber = this.data.payload;

    this.contactForm = new FormGroup({
      countryCode: new FormControl('+234'),
      phoneNumber: new FormControl(null, Validators.required),
    });

    let timer = 29;

    setInterval(() => {
      timer = timer - 1;
      if (timer >= 0) {
        this.resendTimer = timer;
      }
    }, 1000);

    this.otpInput = new FormControl<string>(null, Validators.required);

    this.otpInput.valueChanges.subscribe((data) => {
      if (data.length === 6) {
        this.onVerify();
      }
    });
  }

  updateUser() {
    this.userId = this.authService.getLoggedInUser().id;

    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user.data.user;
      },
      error: (err) => {},
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    this.isSubmitting = true;
  }

  onVerify() {
    if (this.otpInput.value.length !== 6) {
      return;
    }

    this.isSubmitting = true;

    switch (this.otpType) {
      case 'phoneNumberOTP':
        this.authService
          .verifyPersonalPhoneNumber({
            phoneNumber: this.phoneNumber,
            otp: this.otpInput.value,
          })
          .subscribe({
            next: (data) => {
              this.userService.isPhoneVerified.next(true);
              this.isVerified = true;
              this.isVerifying = false;
              this.isSubmitting = false;
              this.toast.success('Phone verified successfully');
            },
            error: (err) => {
              this.isSubmitting = false;

              this.toast.error(err.error.data[0]);
            },
          });
    }
  }

  onResendOtp() {
    this.authService.sendPersonalPhoneOTP().subscribe({
      next: (data) => {
        this.toast.success('OTP resent successfully!');
      },
      error: (err) => {},
    });
  }

  onContinue() {
    this.dialog.closeAll();
    this.updateUser();
  }
}
