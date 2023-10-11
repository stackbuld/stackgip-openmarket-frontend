import { ToastrService } from '../../../../services/toastr.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { OTPDialogComponent } from '../otp-dialog/otp-dialog.component';
import { SellerService } from 'src/app/services/seller/seller.service';
import { IUser } from 'src/app/models/IUserModel';

@Component({
  selector: 'app-change-password',
  templateUrl: './seller-profile-settings.component.html',
  styleUrls: ['./seller-profile-settings.component.scss'],
})
export class SellerProfileSettingsComponent implements OnInit {
  isActive: boolean;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  pinForm: FormGroup;
  passwordMatch: boolean = false;
  isSendingPasswordOTP: boolean = false;
  isSendingPinOTP: boolean = false;
  isSendingDeactivateOTP: boolean = false;
  pinMatch: boolean = false;
  userId: string;
  user: IUser;
  userPhoneNumber: string;
  sellerStatus: boolean;
  isFetching: boolean = false;
  isSubmited = false;
  errors: string[] = [];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sellerService: SellerService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}

  get f() {
    return this.profileForm.controls;
  }
  ngOnInit(): void {
    this.isFetching = true;
    this.userId = this.authService.getLoggedInUser().id;
    this.passwordForm = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.pinForm = new FormGroup({
      newPin: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
      ]),
      confirmPin: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
      ]),
    });

    this.sellerService.isSellerActivated.subscribe((status) => {
      this.isActive = status;
      this.sellerStatus = status;
    });

    this.sellerService.getSeller(this.userId).subscribe({
      next: (user) => {
        this.isFetching = false;
        this.isActive = user.data.isActive;
        this.sellerStatus = user.data.isActive;
        this.user = user.data;
      },
      error: (err) => {
        this.toast.error(err.error.message);
      },
    });
  }

  get password() {
    return <FormControl>this.passwordForm.controls['password'];
  }

  get confirmPassword() {
    return <FormControl>this.passwordForm.controls['confirmPassword'];
  }

  get newPin() {
    return <FormControl>this.pinForm.controls['newPin'];
  }

  get confirmPin() {
    return <FormControl>this.pinForm.controls['confirmPin'];
  }

  onKey(event: Event) {
    if (this.password.value === this.confirmPassword.value) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
  }

  onPin(event: Event) {
    if (this.newPin.value === this.confirmPin.value) {
      this.pinMatch = true;
    } else {
      this.pinMatch = false;
    }
  }

  onVerify() {
    if (this.passwordForm.invalid || !this.passwordMatch) {
      return;
    }

    this.isSendingPasswordOTP = true;
    this.authService.sendPasswordChangeOTP().subscribe({
      next: (data) => {
        this.isSendingPasswordOTP = false;

        const dialogRef = this.dialog.open(OTPDialogComponent, {
          panelClass: 'otp_dialog',
          data: { type: 'changePasswordOTP', payload: this.password.value },
        });

        this.toast.success(
          'OTP sent successfully. Please check your SMS inbox!'
        );

        this.passwordForm.reset();
      },
      error: (err) => {
        this.isSendingPasswordOTP = false;

        this.toast.error(err.error.message);
      },
    });
  }

  onVerifyOTPForPin() {
    if (this.pinForm.invalid || !this.pinMatch) {
      return;
    }

    this.isSendingPinOTP = true;
    this.authService.sendPinChangeOTP().subscribe({
      next: (data) => {
        this.isSendingPinOTP = false;

        const dialogRef = this.dialog.open(OTPDialogComponent, {
          panelClass: 'otp_dialog',
          data: { type: 'changePinOTP', payload: this.newPin.value },
        });

        this.toast.success(
          'OTP sent successfully. Please check your SMS inbox!'
        );

        this.passwordForm.reset();
      },
      error: (err) => {
        this.isSendingPinOTP = false;

        this.toast.error(err.error.message);
      },
    });
  }

  toggle() {
    this.isActive = !this.isActive;
  }

  onVerifyDeactivate() {
    if (!this.isActive) {
      this.isSendingDeactivateOTP = true;

      this.authService.sendDeactivateSellerOTP().subscribe({
        next: (data) => {
          this.isSendingDeactivateOTP = false;
          const dialogRef = this.dialog.open(OTPDialogComponent, {
            panelClass: 'otp_dialog',
            data: { type: 'deactivate' },
          });

          this.toast.success(
            'OTP sent successfully. Please check your SMS inbox!'
          );
        },
        error: (err) => {
          this.toast.error(err.error.message);
        },
      });
    } else if (this.isActive) {
      this.isSendingDeactivateOTP = true;

      this.authService
        .sendActivateSellerOTP({ phoneNumber: this.user.phoneNumber })
        .subscribe({
          next: (data) => {
            this.isSendingDeactivateOTP = false;
            const dialogRef = this.dialog.open(OTPDialogComponent, {
              panelClass: 'otp_dialog',
              data: { type: 'activate', payload: this.user.email },
            });

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
