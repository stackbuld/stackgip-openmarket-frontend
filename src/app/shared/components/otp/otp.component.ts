import { Component, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup } from '@angular/forms';
import { NgxOtpInputConfig } from 'ngx-otp-input';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements ControlValueAccessor {
  @Output() closeEvent = new EventEmitter()
  @Output() submitEvent = new EventEmitter()
  @Input() controls: FormControl;
  otpForm: FormGroup;
  onChange?: (value: string) => void;
  onTouched?: () => void;
  inputs: any = new FormArray(Array.from([1,2,3,4]).map((val: any) => new FormControl('')))
   otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      inputBox: 'my-super-box-class',
      input: 'my-super-class',
      inputFilled: 'my-super-filled-class',
      inputDisabled: 'my-super-disable-class',
      inputSuccess: 'my-super-success-class',

      inputError: 'my-super-error-class',
    },
  };
  constructor(private elementRef: ElementRef) { }


  

  close(): void{
    this.elementRef.nativeElement.remove();
    this.closeEvent.emit()
  }



     handeOtpChange(value: string[]): void {
    console.log(value);
  }

  handleFillEvent(value: string): void {
    console.log(value);
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }
}
