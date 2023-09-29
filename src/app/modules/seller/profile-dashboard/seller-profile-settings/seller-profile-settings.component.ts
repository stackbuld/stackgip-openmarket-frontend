import { ToastrService } from '../../../../services/toastr.service';
import { AuthService } from 'src/app/services/auth.service';

import { IUpdatePassword } from '../../../../models/auth-model';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { nigeriaSates } from 'src/app/data/nigeriastates';
import { MustMatch } from 'src/app/helpers/control-validators';
import { MatDialog } from '@angular/material/dialog';
import { SellerKycComponent } from '../seller-kyc/seller-kyc.component';
import { OTPDialogComponent } from '../otp-dialog/otp-dialog.component';
import { log } from 'console';

@Component({
  selector: 'app-change-password',
  templateUrl: './seller-profile-settings.component.html',
  styleUrls: ['./seller-profile-settings.component.scss'],
})
export class SellerProfileSettingsComponent implements OnInit {
  isToggled: boolean = false;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  pinForm: FormGroup;
  passwordMatch: boolean = false;
  isSendingPasswordOTP: boolean = false;
  isSendingPinOTP: boolean = false;
  pinMatch: boolean = false;

  isSubmited = false;
  errors: string[] = [];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}

  get f() {
    return this.profileForm.controls;
  }
  ngOnInit(): void {
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

  update() {
    // if (this.profileForm.invalid) {
    //   return;
    // }
    // const updatePassword: IUpdatePassword = {
    //   currentPassword: this.profileForm.get('currentPassword').value,
    //   newPassword: this.profileForm.get('confirmPassword').value,
    // };
    // this.isSubmited = true;
    // this.errors = [];
    // this.authService.UpdatePassword(updatePassword).subscribe(
    //   (a) => {
    //     this.isSubmited = false;
    //     this.toast.success('password updated successfully');
    //   },
    //   (error) => {
    //     this.isSubmited = false;
    //     this.errors = error.error.errors.map((a) => a.description);
    //   }
    // );
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
    this.isToggled = !this.isToggled;
  }
}
