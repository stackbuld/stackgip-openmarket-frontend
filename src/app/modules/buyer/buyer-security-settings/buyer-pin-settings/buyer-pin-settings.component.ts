import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buyer-pin-settings',
  templateUrl: './buyer-pin-settings.component.html',
  styleUrls: ['./buyer-pin-settings.component.scss'],
})
export class BuyerPinSettingsComponent implements OnInit {
  pinForm: FormGroup;
  pinMatch: boolean;

  constructor() {}
  ngOnInit(): void {
    this.pinForm = new FormGroup({
      currentPin: new FormControl(null, [Validators.required]),
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

  onSubmit() {}
}
