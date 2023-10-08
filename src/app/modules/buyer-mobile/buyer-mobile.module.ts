import { NgModule } from '@angular/core';

import { BuyerMobileComponent } from './buyer-mobile.component';
import { RouterModule } from '@angular/router';
import { MBuyerPersonalInformationComponent } from './m-buyer-personal-information/m-buyer-personal-information.component';
import { MBuyerContactInformationComponent } from './m-buyer-contact-information/m-buyer-contact-information.component';
import { MBuyerAddressInformationComponent } from './m-buyer-address-information/m-buyer-address-information.component';
import { MBuyerChangePasswordComponent } from './m-buyer-change-password/m-buyer-change-password.component';
import { MBuyerPinSettingsComponent } from './m-buyer-pin-settings/m-buyer-pin-settings.component';
import { MBuyerDeleteAccountComponent } from './m-buyer-delete-account/m-buyer-delete-account.component';
import { MBuyerSidebarComponent } from './m-buyer-sidebar/m-buyer-sidebar.component';
import { BuyerMobileRoutingModule } from './buyer-mobile-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BuyerModule } from '../buyer/buyer.module';

@NgModule({
  imports: [BuyerMobileRoutingModule, CommonModule, SharedModule, BuyerModule],
  declarations: [
    BuyerMobileComponent,
    MBuyerPersonalInformationComponent,
    MBuyerContactInformationComponent,
    MBuyerAddressInformationComponent,
    MBuyerChangePasswordComponent,
    MBuyerPinSettingsComponent,
    MBuyerDeleteAccountComponent,
    MBuyerSidebarComponent,
  ],
  exports: [],
})
export class BuyerMobileModule {}
