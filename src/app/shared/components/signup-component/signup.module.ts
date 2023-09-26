import { CommonModule } from "@angular/common";
import { SignupComponent} from "./signup.component";
import { NgxOtpInputModule } from "ngx-otp-input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgOtpInputModule } from "ng-otp-input";
import { SharedModule } from "../../shared.module";
import { NgModule } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    NgxOtpInputModule,
    FormsModule,
    NgOtpInputModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  exports: [
    SignupComponent,
  ]
})
export class SignupModule { }