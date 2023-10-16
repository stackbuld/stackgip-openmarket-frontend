import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IUser } from 'src/app/models/IUserModel';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { BuyerSecurityOtpComponent } from '../../buyer-security-settings/buyer-security-otp/buyer-security-otp.component';
import { ToastrService } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-buyer-delete-account',
  templateUrl: './buyer-delete-account.component.html',
  styleUrls: ['./buyer-delete-account.component.scss'],
})
export class BuyerDeleteAccountComponent implements OnInit {
  showPassword: boolean;
  isFetching: boolean = false;
  isActive: boolean = false;
  isSubmitting: boolean = false;
  userId: string;
  user: IUser;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {
    this.userService.userActivated.subscribe(
      (status) => (this.isActive = status)
    );
    this.updateUser();
  }

  updateUser() {
    this.isFetching = true;
    69;
    this.userId = this.authService.getLoggedInUser().id;

    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.isActive = user.data.isActive;
        this.user = user.data;
        console.log(user.data);

        this.isFetching = false;
      },
      error: (err) => {
        this.isFetching = false;
      },
    });
  }

  onToggleVisibility() {
    this.showPassword = !this.showPassword;
  }

  onActivate() {
    this.isSubmitting = true;

    this.authService
      .sendActivateSellerOTP({ phoneNumber: this.user.phoneNumber })
      .subscribe({
        next: (data) => {
          this.isSubmitting = false;
          const dialogRef = this.dialog.open(BuyerSecurityOtpComponent, {
            panelClass: 'otp_dialog',
            data: { type: 'activate', payload: this.user.email },
          });

          this.toast.success('OTP sent!. Please check your SMS inbox!');
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error(err.error.message);
        },
      });
  }

  onDeactivate() {
    this.isSubmitting = true;

    this.authService.sendDeactivateSellerOTP().subscribe({
      next: (data) => {
        this.isSubmitting = false;
        const dialogRef = this.dialog.open(BuyerSecurityOtpComponent, {
          panelClass: 'otp_dialog',
          data: { type: 'deactivate' },
        });

        this.toast.success('OTP sent!. Please check your SMS inbox!');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error(err.error.message);
      },
    });
  }
}
