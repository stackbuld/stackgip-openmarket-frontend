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
import { IUser } from 'src/app/models/IUserModel';
import {
  ISeller,
  SellerBusinessProfileData,
  SellerProfileData,
} from 'src/app/models/sellerModel';
import { AuthService } from 'src/app/services/auth.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import { ToastrService } from 'src/app/services/toastr.service';
import { NgOtpInputComponent } from 'ng-otp-input';

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
  userId: string;
  user: IUser;
  specificProfileData: SellerProfileData;
  specificBusinessData: SellerBusinessProfileData;
  resendTimer: number = 29;

  @ViewChild('otp_dialog') otpDialog: ElementRef<HTMLDivElement>;
  @ViewChild(NgOtpInputComponent, { static: false })
  ngOtpInput: NgOtpInputComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { type: string; payload: string; phoneNumber: string },
    private authService: AuthService,
    private toaster: ToastrService,
    private dialog: MatDialog,
    private sellerService: SellerService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.resendTimerF();

    this.otpInput = new FormControl(null, Validators.required);
    this.otpData = this.data.payload;
    this.otpType = this.data.type;
    this.phoneNumber = this.data.phoneNumber;

    this.userId = this.authService.getLoggedInUser().id;
    this.sellerService.getSeller(this.userId).subscribe({
      next: (seller) => {
        this.user = seller.data;

        this.specificProfileData = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          bio: this.user.bio,
          personalIdUrl: this.user.personalIdUrl,
          profileImageUrl: this.user.profileImageUrl,
          alpha2CountryCode: this.user.alpha2CountryCode,
          state: this.user.state,
          phoneNumber: this.user.phoneNumber,
          coverPhotoUrl: this.user.coverPhotoUrl,
        };

        this.specificBusinessData = {
          businessName: this.user.businessName,
          businessEmail: this.user.businessEmail,
          businessPhone: this.user.businessPhone,
          businessAddress: this.user.businessAddress,
          businessState: this.user.businessState,
          businessCountryCode: this.user.businessCountryCode,
          businessWebsite: this.user.businessWebsite,
          businessSocialLinks: this.user.businessSocialLinks,
        };
      },
      error: (err) => {},
    });

    this.otpInput.valueChanges.subscribe((data) => {
      if (data && data.length === 6) {
        this.onVerify();
      }
    });
  }

  ngAfterViewChecked(): void {}

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
              this.toaster.success('Password changed successfully');

              this.dialog.closeAll();
            },
            error: (err) => {
              this.isSubmitting = false;
              this.toaster.error(err.error.data[0]);
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
              this.toaster.error(err.error.data[0]);
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
              this.toaster.error(err.error.data[0]);
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
              this.toaster.error(err.error.data[0]);
            },
          });
        break;

      case 'deactivate':
        this.authService
          .deactivateSeller({ otp: this.otpInput.value })
          .subscribe({
            next: (data) => {
              this.isSubmitting = false;
              this.sellerService.isSellerActivated.next(false);
              this.toaster.success(
                'Your seller account has been deactivated successfully'
              );
            },
            error: (err) => {
              console.log(err);
              this.isSubmitting = false;

              this.toaster.error(err.error.data[0]);
            },
          });
        break;

      case 'activate':
        this.authService
          .activateSeller({ email: this.otpData, otp: this.otpInput.value })
          .subscribe({
            next: (data) => {
              this.isSubmitting = false;
              this.sellerService.isSellerActivated.next(true);
              this.toaster.success(
                'Your seller account has been activated successfully'
              );
            },
            error: (err) => {
              console.log(err);
              this.isSubmitting = false;

              this.toaster.error(err.error.data[0]);
            },
          });
        break;
    }
  }

  onResendOtp(type: string) {
    this.ngOtpInput.setValue(null);
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
      case 'phoneNumberOTP':
        this.authService.sendPersonalPhoneOTP().subscribe({
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
      case 'businessPhoneNumberOTP':
        this.authService.sendBusinessPhoneOTP().subscribe({
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
            phoneNumber: this.specificProfileData.phoneNumber,
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
