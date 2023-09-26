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
import { AuthService } from 'src/app/services/auth.service';
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
  otpType: string;
  otpData: string;

  @ViewChild('otp_dialog') otpDialog: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { type: string; payload: string },
    private authService: AuthService,
    private toaster: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.otpForm = new FormGroup({
      otp: new FormControl(null, Validators.required),
    });

    this.otpInput = new FormControl(null, Validators.required);
    this.otpData = this.data.payload;
    this.otpType = this.data.type;
  }

  ngAfterViewChecked(): void {}

  onVerify() {
    if (this.otpInput.value.length !== 6) {
      return;
    }

    this.isSubmitting = true;
    console.log(this.otpData);

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
              console.log(err);
              this.isSubmitting = false;
              this.toaster.error('Something went wrong');
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
              console.log(err);
              this.isSubmitting = false;
              this.toaster.error('Something went wrong');
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
              this.toaster.success('Phone number verified successfully');
              this.dialog.closeAll();
            },
            error: (err) => {
              console.log(err);
              this.isSubmitting = false;
              this.toaster.error('Something went wrong');
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
              this.toaster.success(
                "Company's Phone number verified successfully"
              );
              this.dialog.closeAll();
            },
            error: (err) => {
              console.log(err);
              this.isSubmitting = false;
              this.toaster.error('Something went wrong');
            },
          });
    }
  }
}
