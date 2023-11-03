import { NgModule } from '@angular/core';
import { BuyerComponent } from './buyer.component';
import { BuyerRoutingModule } from './buyer-routing.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { BuyerProfileComponent } from './buyer-profile/buyer-profile.component';
import { BuyerPersonalInformationComponent } from './buyer-profile/buyer-personal-information/buyer-personal-information.component';
import { BuyerContactInformationComponent } from './buyer-profile/buyer-contact-information/buyer-contact-information.component';
import { BuyerAddressInformationComponent } from './buyer-profile/buyer-address-information/buyer-address-information.component';
import { BuyerSecuritySettingsComponent } from './buyer-security-settings/buyer-security-settings.component';
import { BuyerChangePasswordComponent } from './buyer-security-settings/buyer-change-password/buyer-change-password.component';
import { BuyerPinSettingsComponent } from './buyer-security-settings/buyer-pin-settings/buyer-pin-settings.component';
import { BuyerDeleteAccountComponent } from './buyer-deactivate/buyer-delete-account/buyer-delete-account.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BuyerSidebarComponent } from './buyer-sidebar/buyer-sidebar.component';
import { BuyerDeactivateComponent } from './buyer-deactivate/buyer-deactivate.component';
import { BuyerNavComponent } from './buyer-nav/buyer-nav.component';
import { BuyerHeaderComponent } from './buyer-header/buyer-header.component';
import { BuyerContactDialogComponent } from './buyer-profile/buyer-contact-information/buyer-contact-dialog/buyer-contact-dialog.component';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { NgOtpInputModule } from 'ng-otp-input';
import { BuyerSecurityOtpComponent } from './buyer-security-settings/buyer-security-otp/buyer-security-otp.component';
import { BuyerWalletComponent } from './buyer-profile/buyer-wallet/buyer-wallet.component';
import { WalletModule } from 'src/app/shared/wallet/wallet.module';
import { BuyerEmailDialogComponent } from './buyer-profile/buyer-personal-information/buyer-email-dialog/buyer-email-dialog.component';

@NgModule({
  imports: [
    BuyerRoutingModule,
    CommonModule,
    SharedModule,
    NgOtpInputModule,
    GooglePlaceModule,
    WalletModule,
  ],
  declarations: [
    BuyerComponent,
    BuyerProfileComponent,
    BuyerPersonalInformationComponent,
    BuyerContactInformationComponent,
    BuyerAddressInformationComponent,
    BuyerSecuritySettingsComponent,
    BuyerChangePasswordComponent,
    BuyerPinSettingsComponent,
    BuyerDeleteAccountComponent,
    BuyerSidebarComponent,
    BuyerDeactivateComponent,
    BuyerNavComponent,
    BuyerHeaderComponent,
    BuyerContactDialogComponent,
    BuyerSecurityOtpComponent,
    BuyerWalletComponent,
    BuyerEmailDialogComponent,
  ],
  exports: [
    BuyerHeaderComponent,
    BuyerAddressInformationComponent,
    BuyerPersonalInformationComponent,
    BuyerContactInformationComponent,
    BuyerChangePasswordComponent,
    BuyerPinSettingsComponent,
    BuyerDeleteAccountComponent,
    BuyerContactDialogComponent,
    BuyerSidebarComponent,
    NgOtpInputModule,
    BuyerSecurityOtpComponent,
    GooglePlaceModule,
    BuyerWalletComponent,
  ],
})
export class BuyerModule {}
