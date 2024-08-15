import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'src/app/services/toastr.service';

import { AuthService } from 'src/app/services/auth.service';
import { BuyerSecurityOtpComponent } from '../buyer-security-otp/buyer-security-otp.component';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-buyer-change-password',
  templateUrl: './buyer-change-password.component.html',
  styleUrls: ['./buyer-change-password.component.scss'],
})
export class BuyerChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  showCurPassword: boolean;
  showNewPassword: boolean;
  showConfirmNewPassword: boolean;
  passwordMatch: boolean;
  isSubmitting: boolean;
  userId: string;
  phoneNumber: string;

  constructor(
    private dialog: MatDialog,
    private toast: ToastrService,
    private authService: AuthService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      newPassword: new FormControl(null, Validators.required),
      confirmNewPassword: new FormControl(null, Validators.required),
    });

    this.userId = this.authService.getLoggedInUser().id;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.phoneNumber = user.data.user.phoneNumber;
      },
    });
  }

  get password() {
    return <FormControl>this.passwordForm.controls['newPassword'];
  }

  get confirmPassword() {
    return <FormControl>this.passwordForm.controls['confirmNewPassword'];
  }

  onToggleVisibility(type: string) {
    switch (type) {
      case 'currentPassword':
        this.showCurPassword = !this.showCurPassword;
        break;

      case 'newPassword':
        this.showNewPassword = !this.showNewPassword;
        break;

      case 'confirmNewPassword':
        this.showConfirmNewPassword = !this.showConfirmNewPassword;
    }
  }

  onPasswordEnter($event) {
    if (this.password.value === this.confirmPassword.value) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
  }

  onSubmit() {
    if (this.passwordForm.invalid || !this.passwordMatch) {
      return;
    }

    this.isSubmitting = true;

    this.authService.sendPasswordChangeOTP().subscribe({
      next: (data) => {
        this.isSubmitting = false;

        const dialogRef = this.dialog.open(BuyerSecurityOtpComponent, {
          panelClass: 'otp_dialog',
          data: {
            type: 'changePasswordOTP',
            payload: this.password.value,
            phoneNumber: this.phoneNumber,
          },
        });

        this.toast.success('OTP sent! Please check your SMS inbox!');

        this.passwordForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;

        this.toast.error(err.error.message);
      },
    });
  }
}
