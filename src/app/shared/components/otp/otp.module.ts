import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpComponent } from './otp.component';
import { OtpService } from './service/otp.service';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';



@NgModule({
  declarations: [
    OtpComponent
  ],
  imports: [
    CommonModule,
    // NgxOtpInputModule,
    FormsModule,
    ReactiveFormsModule,
    // NgOtpInputModule
  ],

  exports: [
    NgxOtpInputModule,
    NgOtpInputModule,
  ],
  providers: [OtpService]
})
export class OtpModule { }
