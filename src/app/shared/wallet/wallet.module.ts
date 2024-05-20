import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { WalletOverviewComponent } from './wallet-overview/wallet-overview.component';
import { WalletWithdrawComponent } from './wallet-withdraw/wallet-withdraw.component';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { NgOtpInputModule } from 'ng-otp-input';
import {
  TransactionAmount,
  TransactionDirective,
} from '../directives/transaction.directive';
import { DateRangePicker } from '../components/date-range/date-range';
import { JsonPipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NinAndKYCVerificationAlert } from '../components/mat-snackbar/nin-kyc-verification-status-alert';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    WalletComponent,
    WalletOverviewComponent,
    WalletWithdrawComponent,
    DateRangePicker,
    NinAndKYCVerificationAlert,
  ],
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    JsonPipe,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    CommonModule,
    WalletRoutingModule,
    NgxOtpInputModule,
    MatTooltipModule,
    FormsModule,
    NgOtpInputModule,
    SharedModule,
    ReactiveFormsModule,
    TransactionDirective,
    TransactionAmount,
    RouterLink,
    MatButtonModule,
  ],
  exports: [WalletComponent, WalletOverviewComponent, WalletWithdrawComponent],
})
export class WalletModule {}
