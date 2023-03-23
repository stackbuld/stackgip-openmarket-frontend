import { AuthComponent } from './auth.component';
import { SiginupComponent } from './siginup/siginup.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountConfirmationComponent } from './account-confirmation/account-confirmation.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'src/app/shared/pagination/ngx-pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SiginupComponent,
    ForgetPasswordComponent,
    AccountConfirmationComponent,
    ResetPasswordComponent,
    ResetPasswordComponent,
    AccountConfirmationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    SharedModule,
    NgxSliderModule,
    NgxPaginationModule,
    NgxSliderModule,
    MatPaginatorModule,
  ],
})
export class AuthModule {}
