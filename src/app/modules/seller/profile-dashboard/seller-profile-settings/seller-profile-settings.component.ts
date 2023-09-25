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

@Component({
  selector: 'app-change-password',
  templateUrl: './seller-profile-settings.component.html',
  styleUrls: ['./seller-profile-settings.component.scss'],
})
export class SellerProfileSettingsComponent implements OnInit {
  isToggled: boolean = false;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  passwordMatch: boolean = false;

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
    // this.profileForm = this.fb.group(
    //   {
    //     currentPassword: ['', [Validators.required]],
    //     password: ['', [Validators.required, Validators.minLength(6)]],
    //     confirmPassword: ['', [Validators.required]],
    //   },
    //   {
    //     validators: MustMatch('password', 'confirmPassword'),
    //   }
    // );

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
  }

  get password() {
    return <FormControl>this.passwordForm.controls['password'];
  }

  get confirmPassword() {
    return <FormControl>this.passwordForm.controls['confirmPassword'];
  }

  onKey(event: Event) {
    if (this.password.value === this.confirmPassword.value) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
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

    console.log(this.passwordForm);
    this.authService.sendOTP().subscribe({
      next: (data) => {
        console.log(data);
        const dialogRef = this.dialog.open(OTPDialogComponent, {
          panelClass: 'otp_dialog',
          data: { password: this.password.value },
        });
      },
    });
  }

  toggle() {
    this.isToggled = !this.isToggled;
  }
}
