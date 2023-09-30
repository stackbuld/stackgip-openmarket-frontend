import {
  AfterViewChecked,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { log } from 'console';
import { IUser } from 'src/app/models/IUserModel';
import {
  SellerBusinessProfileData,
  SellerProfileData,
} from 'src/app/models/sellerModel';
import { AuthService } from 'src/app/services/auth.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import { ToastrService } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.scss'],
})
export class OTPDialogComponent implements OnInit, AfterViewChecked {
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

  otpForm: FormGroup;
  otpInput: FormControl;
  isSubmitting: boolean = false;
  isResending: boolean = false;
  otpType: string;
  otpData: string;
  phoneNumber: string;
  specificProfileData: SellerProfileData;
  specificBusinessData: SellerBusinessProfileData;
  resendTimer: number = 29;

  @ViewChild('otp_dialog') otpDialog: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { type: string; payload: string },
    private authService: AuthService,
    private toaster: ToastrService,
    private dialog: MatDialog,
    private sellerService: SellerService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.otpForm = new FormGroup({
      otp: new FormControl(null, Validators.required),
    });

    let timer = 29;

    setInterval(() => {
      timer = timer - 1;
      if (timer >= 0) {
        this.resendTimer = timer;
      }
    }, 1000);

    this.otpInput = new FormControl(null, Validators.required);
    this.otpData = this.data.payload;
    this.otpType = this.data.type;

    const user: IUser = JSON.parse(localStorage.getItem('user')!);
    this.phoneNumber = user.phoneNumber;

    this.specificProfileData = {
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      profileImageUrl: user.profileImageUrl,
      alpha2CountryCode: user.alpha2CountryCode,
      state: user.state,
      phoneNumber: user.phoneNumber,
      coverPhotoUrl: user.coverPhotoUrl,
    };

    this.specificBusinessData = {
      businessName: user.businessName,
      businessEmail: user.businessEmail,
      businessPhone: user.businessPhone,
      businessAddress: user.businessAddress,
      businessState: user.businessState,
      businessCountryCode: user.businessCountryCode,
      businessWebsite: user.businessWebsite,
      businessSocialLinks: user.businessSocialLinks,
    };
  }

  ngAfterViewChecked(): void {}

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
              this.toaster.success('Password changed successfully');
              this.dialog.closeAll();
            },
            error: (err) => {
              this.isSubmitting = false;
              this.toaster.error(err.error.message);
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
              this.toaster.success('Pin changed successfully');
              this.dialog.closeAll();
            },
            error: (err) => {
              this.isSubmitting = false;
              this.toaster.error(err.error.message);
            },
          });
        break;

      case 'phoneNumberOTP':
        this.authService
          .verifyPersonalPhoneNumber({
            phoneNumber: this.otpData,
            otp: this.otpInput.value,
          })
          .subscribe({
            next: (data) => {
              this.isSubmitting = false;
              this.sellerService.phoneNumberConfirmed.next(true);
              this.toaster.success('Phone number verified successfully');
              this.dialog.closeAll();
            },
            error: (err) => {
              this.isSubmitting = false;
              this.toaster.error(err.error.message);
            },
          });
        break;

      case 'businessPhoneNumberOTP':
        this.authService
          .verifyBusinessPhoneNumber({
            businessPhone: this.otpData,
            otp: this.otpInput.value,
          })
          .subscribe({
            next: (data) => {
              this.isSubmitting = false;
              this.sellerService.businessPhoneConfirmed.next(true);

              this.toaster.success(
                "Company's Phone number verified successfully"
              );
              this.dialog.closeAll();
            },
            error: (err) => {
              this.isSubmitting = false;
              this.toaster.error(err.error.message);
            },
          });
    }
  }

  onResendOtp(type: string) {
    switch (this.otpType) {
      case 'changePasswordOTP':
        this.authService.sendPasswordChangeOTP().subscribe({
          next: (data) => {
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
            this.toast.success(
              'OTP sent successfully. Please check your SMS inbox!'
            );
          },
          error: (err) => {
            this.toast.error(err.error.message);
          },
        });
        break;
      case 'phoneNumberOTP':
        this.authService.sendPersonalPhoneOTP().subscribe({
          next: (data) => {
            this.toast.success(
              'OTP sent successfully. Please check your SMS inbox!'
            );
          },
          error: (err) => {
            this.toast.error(err.error.message);
          },
        });
        break;
      case 'businessPhoneNumberOTP':
        this.authService.sendBusinessPhoneOTP().subscribe({
          next: (data) => {
            this.toast.success(
              'OTP sent successfully. Please check your SMS inbox!'
            );
          },
          error: (err) => {
            this.toast.error(err.error.message);
          },
        });
    }
  }
}
