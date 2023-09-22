import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.scss'],
})
export class OTPDialogComponent implements OnInit, AfterViewChecked {
  config = {
    allowNumbersOnly: false,
    length: 4,
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
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
      borderRadius: '8px',
      boxShadow: '0 0 3px #ccc',
    },
    inputClass: 'otp-c-input',
  };

  config3 = {
    allowNumbersOnly: false,
    length: 4,
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

  @ViewChild('otp_dialog') otpDialog: ElementRef<HTMLDivElement>;

  windowSize = document.body;

  ngOnInit(): void {}

  ngAfterViewChecked(): void {}
}
