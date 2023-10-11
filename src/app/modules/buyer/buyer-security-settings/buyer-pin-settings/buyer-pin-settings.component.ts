import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'src/app/services/toastr.service';
import { BuyerSecurityOtpComponent } from '../buyer-security-otp/buyer-security-otp.component';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-buyer-pin-settings',
  templateUrl: './buyer-pin-settings.component.html',
  styleUrls: ['./buyer-pin-settings.component.scss'],
})
export class BuyerPinSettingsComponent implements OnInit {
  pinForm: FormGroup;
  pinMatch: boolean;
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

    this.userId = this.authService.getLoggedInUser().id;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.phoneNumber = user.data.phoneNumber;
      },
    });
  }

  get newPin() {
    return <FormControl>this.pinForm.controls['newPin'];
  }

  get confirmPin() {
    return <FormControl>this.pinForm.controls['confirmPin'];
  }

  onPinEnter(event: Event) {
    if (this.newPin.value === this.confirmPin.value) {
      this.pinMatch = true;
    } else {
      this.pinMatch = false;
    }
  }

  onSubmit() {
    if (this.pinForm.invalid || !this.pinMatch) {
      return;
    }
    this.isSubmitting = true;
    this.authService.sendPinChangeOTP().subscribe({
      next: (data) => {
        this.isSubmitting = false;

        const dialogRef = this.dialog.open(BuyerSecurityOtpComponent, {
          panelClass: 'otp_dialog',
          data: {
            type: 'changePinOTP',
            payload: this.newPin.value,
            phoneNumber: this.phoneNumber,
          },
        });

        this.toast.success('OTP sent!. Please check your SMS inbox!');

        this.pinForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;

        this.toast.error(err.error.message);
      },
    });
  }
}
