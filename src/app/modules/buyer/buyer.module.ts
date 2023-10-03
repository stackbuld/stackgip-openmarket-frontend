import { NgModule } from '@angular/core';
import { BuyerComponent } from './buyer.component';
import { BuyerRoutingModule } from './buyer-routing.module';
import { BuyerProfileComponent } from './buyer-profile/buyer-profile.component';
import { BuyerPersonalInformationComponent } from './buyer-profile/buyer-personal-information/buyer-personal-information.component';
import { BuyerContactInformationComponent } from './buyer-profile/buyer-contact-information/buyer-contact-information.component';
import { BuyerAddressInformationComponent } from './buyer-profile/buyer-address-information/buyer-address-information.component';
import { BuyerSecuritySettingsComponent } from './buyer-security-settings/buyer-security-settings.component';
import { BuyerChangePasswordComponent } from './buyer-security-settings/buyer-change-password/buyer-change-password.component';
import { BuyerPinSettingsComponent } from './buyer-security-settings/buyer-pin-settings/buyer-pin-settings.component';
import { BuyerDeleteAccountComponent } from './buyer-security-settings/buyer-delete-account/buyer-delete-account.component';

@NgModule({
  imports: [BuyerRoutingModule],
  declarations: [BuyerComponent, BuyerProfileComponent, BuyerPersonalInformationComponent, BuyerContactInformationComponent, BuyerAddressInformationComponent, BuyerSecuritySettingsComponent, BuyerChangePasswordComponent, BuyerPinSettingsComponent, BuyerDeleteAccountComponent],
  exports: [],
})
export class BuyerModule {}
