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

@NgModule({
  declarations: [
    WalletComponent,
    WalletOverviewComponent,
    WalletWithdrawComponent,
  ],
  imports: [
    CommonModule,
    WalletRoutingModule,
    NgxOtpInputModule,
    FormsModule,
    NgOtpInputModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [WalletComponent, WalletOverviewComponent, WalletWithdrawComponent],
})
export class WalletModule {}
