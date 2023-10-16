import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IUser } from 'src/app/models/IUserModel';
import { AuthService } from 'src/app/services/auth.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import { ToastrService } from 'src/app/services/toastr.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-buyer-security-otp',
  templateUrl: './buyer-security-otp.component.html',
  styleUrls: ['./buyer-security-otp.component.scss'],
})
export class BuyerSecurityOtpComponent implements OnInit {
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
      width: '40px',
      height: '40px',
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
      width: '35px',
      height: '35px',
      borderRadius: '8px',
      boxShadow: '0 0 3px #ccc',
    },
    inputClass: 'otp-c-input',
  };

  otpInput: FormControl;
  isSubmitting: boolean = false;
  isResending: boolean = false;
  otpType: string;
  otpData: string;
  phoneNumber: string;
  resendTimer: number = 29;
  userId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { type: string; payload: string; phoneNumber: string },
    private authService: AuthService,
    private dialog: MatDialog,
    private toast: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.resendTimerF();

    this.otpInput = new FormControl<string>(null, Validators.required);
    this.otpData = this.data.payload;
    this.otpType = this.data.type;
    this.phoneNumber = this.data.phoneNumber;

    this.otpInput.valueChanges.subscribe((data) => {
      if (data.length === 6) {
        this.onVerify();
      }
    });
  }

  resendTimerF() {
    let timer = 29;

    setInterval(() => {
      timer = timer - 1;
      if (timer >= 0) {
        this.resendTimer = timer;
      }
    }, 1000);
  }

  onVerify() {
    if (this.otpInput.value.length !== 6) {
      return;
    }

    this.isSubmitting = true;

    switch (this.otpType) {
      case 'changePasswordOTP':
        this.authService
          .UpdatePassword({
            newPassword: this.otpData,
            phoneOtp: this.otpInput.value,
          })
          .subscribe({
            next: (data) => {
              this.isSubmitting = false;
              this.toast.success('Password changed successfully');
              this.dialog.closeAll();
            },
            error: (err) => {
              this.isSubmitting = false;
              this.toast.error(err.error.errors[0]);
            },
          });
        break;

      case 'changePinOTP':
        this.authService
          .updatePin({
            newPin: this.otpData,
            phoneOtp: this.otpInput.value,
          })
          .subscribe({
            next: (data) => {
              this.isSubmitting = false;
              this.toast.success('Pin changed successfully');
              this.dialog.closeAll();
            },
            error: (err) => {
              this.isSubmitting = false;
              this.toast.error(err.error.errors[0]);
            },
          });
        break;

      case 'deactivate':
        this.authService
          .deactivateSeller({ otp: this.otpInput.value })
          .subscribe({
            next: (data) => {
              this.isSubmitting = false;
              this.userService.userActivated.next(false);
              this.toast.success(
                'Your account has been deactivated successfully'
              );
              this.dialog.closeAll();
            },
            error: (err) => {
              console.log(err);
              this.isSubmitting = false;

              this.toast.error(err.error.errors[0]);
            },
          });
        break;

      case 'activate':
        this.authService
          .activateSeller({ email: this.otpData, otp: this.otpInput.value })
          .subscribe({
            next: (data) => {
              this.isSubmitting = false;
              this.userService.userActivated.next(true);
              this.toast.success(
                'Your account has been activated successfully'
              );
              this.dialog.closeAll();
            },
            error: (err) => {
              console.log(err);
              this.isSubmitting = false;

              this.toast.error(err.error.errors[0]);
            },
          });
        break;
    }
  }

  onResendOtp(type: string) {
    switch (this.otpType) {
      case 'changePasswordOTP':
        this.authService.sendPasswordChangeOTP().subscribe({
          next: (data) => {
            this.resendTimer = 29;
            this.resendTimerF();
            this.toast.success(
              'OTP sent successfully. Please check your SMS inbox!'
            );
          },
          error: (err) => {
            this.toast.error(err.error.message);
          },
        });
        break;

      case 'changePinOTP':
        this.authService.sendPinChangeOTP().subscribe({
          next: (data) => {
            this.resendTimer = 29;
            this.resendTimerF();
            this.toast.success(
              'OTP sent successfully. Please check your SMS inbox!'
            );
          },
          error: (err) => {
            this.toast.error(err.error.message);
          },
        });
        break;

      case 'deactivate':
        this.authService.sendDeactivateSellerOTP().subscribe({
          next: (data) => {
            this.resendTimer = 29;
            this.resendTimerF();
            this.toast.success(
              'OTP sent successfully. Please check your SMS inbox!'
            );
          },
          error: (err) => {
            this.toast.error(err.error.message);
          },
        });
        break;

      case 'activate':
        this.authService
          .sendActivateSellerOTP({
            phoneNumber: this.phoneNumber,
          })
          .subscribe({
            next: (data) => {
              this.resendTimer = 29;
              this.resendTimerF();
              this.toast.success(
                'OTP sent successfully. Please check your SMS inbox!'
              );
            },
            error: (err) => {
              this.toast.error(err.error.message);
            },
          });
        break;
    }
  }
}
