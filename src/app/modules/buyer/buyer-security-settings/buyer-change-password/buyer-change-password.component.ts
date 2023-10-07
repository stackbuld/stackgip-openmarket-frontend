import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  constructor() {}
  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      confirmNewPassword: new FormControl(null, Validators.required),
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
}
