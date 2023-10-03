import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyerPersonalInformationComponent } from './buyer-profile/buyer-personal-information/buyer-personal-information.component';
import { BuyerContactInformationComponent } from './buyer-profile/buyer-contact-information/buyer-contact-information.component';
import { BuyerAddressInformationComponent } from './buyer-profile/buyer-address-information/buyer-address-information.component';
import { BuyerChangePasswordComponent } from './buyer-security-settings/buyer-change-password/buyer-change-password.component';
import { BuyerPinSettingsComponent } from './buyer-security-settings/buyer-pin-settings/buyer-pin-settings.component';
import { BuyerDeleteAccountComponent } from './buyer-security-settings/buyer-delete-account/buyer-delete-account.component';
import { BuyerComponent } from './buyer.component';
import { BuyerProfileComponent } from './buyer-profile/buyer-profile.component';

const routes: Routes = [
  {
    path: '',
    component: BuyerComponent,
    children: [
      { path: '', redirectTo: 'personal-information', pathMatch: 'full' },
      {
        path: '',
        component: BuyerProfileComponent,
        children: [
          {
            path: 'personal-information',
            component: BuyerPersonalInformationComponent,
          },
          {
            path: 'contact-information',
            component: BuyerContactInformationComponent,
          },
          {
            path: 'address-information',
            component: BuyerAddressInformationComponent,
          },
        ],
      },

      { path: 'change-password', component: BuyerChangePasswordComponent },
      { path: 'pin-settings', component: BuyerPinSettingsComponent },
      { path: 'deactivate', component: BuyerDeleteAccountComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyerRoutingModule {}
