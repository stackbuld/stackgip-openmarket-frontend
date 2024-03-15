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
import { TransactionsComponent } from './transactions/transactions.component';
import {
  TransactionAmount,
  TransactionDirective,
} from '../directives/transaction.directive';
import { LockedFundsComponent } from './locked-funds/locked-funds.component';

@NgModule({
  declarations: [
    WalletComponent,
    WalletOverviewComponent,
    WalletWithdrawComponent,
    TransactionsComponent,
    LockedFundsComponent,
  ],
  imports: [
    CommonModule,
    WalletRoutingModule,
    NgxOtpInputModule,
    FormsModule,
    NgOtpInputModule,
    SharedModule,
    ReactiveFormsModule,
    TransactionDirective,
    TransactionAmount,
  ],
  exports: [
    WalletComponent,
    WalletOverviewComponent,
    WalletWithdrawComponent,
    TransactionsComponent,
  ],
})
export class WalletModule {}
