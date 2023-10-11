import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'src/app/services/toastr.service';
import { BuyerSecurityOtpComponent } from '../buyer-security-otp/buyer-security-otp.component';

@Component({
  selector: 'app-buyer-pin-settings',
  templateUrl: './buyer-pin-settings.component.html',
  styleUrls: ['./buyer-pin-settings.component.scss'],
})
export class BuyerPinSettingsComponent implements OnInit {
  pinForm: FormGroup;
  pinMatch: boolean;
  isSubmitting: boolean;

  constructor(
    private dialog: MatDialog,
    private toast: ToastrService,
    private authService: AuthService
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
          data: { type: 'changePinOTP', payload: this.newPin.value },
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
