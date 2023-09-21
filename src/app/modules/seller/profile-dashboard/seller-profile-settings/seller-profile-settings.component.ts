import { ToastrService } from '../../../../services/toastr.service';
import { AuthService } from 'src/app/services/auth.service';

import { IUpdatePassword } from '../../../../models/auth-model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { nigeriaSates } from 'src/app/data/nigeriastates';
import { MustMatch } from 'src/app/helpers/control-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './seller-profile-settings.component.html',
  styleUrls: ['./seller-profile-settings.component.scss'],
})
export class SellerProfileSettingsComponent implements OnInit {
  isToggled: boolean = false;
  profileForm: FormGroup;

  isSubmited = false;
  errors: string[] = [];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastrService
  ) {}

  get f() {
    return this.profileForm.controls;
  }
  ngOnInit(): void {
    this.profileForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  update() {
    if (this.profileForm.invalid) {
      return;
    }
    const updatePassword: IUpdatePassword = {
      currentPassword: this.profileForm.get('currentPassword').value,
      newPassword: this.profileForm.get('confirmPassword').value,
    };
    this.isSubmited = true;
    this.errors = [];
    this.authService.UpdatePassword(updatePassword).subscribe(
      (a) => {
        this.isSubmited = false;
        this.toast.success('password updated successfully');
      },
      (error) => {
        this.isSubmited = false;

        this.errors = error.error.errors.map((a) => a.description);
      }
    );
  }

  toggle() {
    this.isToggled = !this.isToggled;
  }
}
