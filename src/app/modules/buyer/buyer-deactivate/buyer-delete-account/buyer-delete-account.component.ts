import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buyer-delete-account',
  templateUrl: './buyer-delete-account.component.html',
  styleUrls: ['./buyer-delete-account.component.scss'],
})
export class BuyerDeleteAccountComponent implements OnInit {
  passwordForm: FormGroup;
  showPassword: boolean;

  constructor() {}
  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      password: new FormControl(null, Validators.required),
    });
  }

  onToggleVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {}
}
