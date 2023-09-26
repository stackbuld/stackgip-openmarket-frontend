import {
  AfterViewChecked,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { log } from 'console';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.scss'],
})
export class OTPDialogComponent implements OnInit, AfterViewChecked {
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '70px',
      height: '70px',
      borderRadius: '8px',
      boxShadow: '0 0 3px #ccc',
    },
    inputClass: 'otp-c-input',
  };

  config2 = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      boxShadow: '0 0 3px #ccc',
    },
    inputClass: 'otp-c-input',
  };

  config3 = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '35px',
      height: '35px',
      borderRadius: '8px',
      boxShadow: '0 0 3px #ccc',
    },
    inputClass: 'otp-c-input',
  };

  otpForm: FormGroup;
  otpInput: FormControl;
  isSubmitting: boolean = false;
  password: string;

  @ViewChild('otp_dialog') otpDialog: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { password: string },
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.otpForm = new FormGroup({
      otp: new FormControl(null, Validators.required),
    });

    this.otpInput = new FormControl(null, Validators.required);
    this.password = this.data.password;
  }

  ngAfterViewChecked(): void {}

  onVerify() {
    if (this.otpInput.value.length !== 6) {
      return;
    }

    this.authService
      .UpdatePassword({
        newPassword: this.password,
        phoneOtp: this.otpInput.value,
      })
      .subscribe((data) => {
        console.log(data);
      });
  }
}
