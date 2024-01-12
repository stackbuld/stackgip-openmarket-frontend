import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyerMobileComponent } from './buyer-mobile.component';
import { MBuyerSidebarComponent } from './m-buyer-sidebar/m-buyer-sidebar.component';
import { MBuyerPersonalInformationComponent } from './m-buyer-personal-information/m-buyer-personal-information.component';
import { MBuyerContactInformationComponent } from './m-buyer-contact-information/m-buyer-contact-information.component';
import { MBuyerAddressInformationComponent } from './m-buyer-address-information/m-buyer-address-information.component';
import { MBuyerChangePasswordComponent } from './m-buyer-change-password/m-buyer-change-password.component';
import { MBuyerPinSettingsComponent } from './m-buyer-pin-settings/m-buyer-pin-settings.component';
import { MBuyerDeleteAccountComponent } from './m-buyer-delete-account/m-buyer-delete-account.component';
import { MBuyerWalletComponent } from './m-buyer-wallet/m-buyer-wallet.component';
const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {
    path: 'profile',
    component: BuyerMobileComponent,
    children: [
      {
        path: '',
        component: MBuyerSidebarComponent,
      },

      {
        path: 'personal-information',
        component: MBuyerPersonalInformationComponent,
      },
      {
        path: 'contact-information',
        component: MBuyerContactInformationComponent,
      },
      {
        path: 'address-information',
        component: MBuyerAddressInformationComponent,
      },
      {
        path: '',
        component: MBuyerWalletComponent,
        children: [
          {
            path: 'wallet',
            loadChildren: () =>
              import('../../shared/wallet/wallet.module').then(
                (m) => m.WalletModule
              ),
          },
        ],
      },
      {
        path: 'wallet',
        loadChildren: () =>
          import('../../shared/wallet/wallet.module').then(
            (m) => m.WalletModule
          ),
      },
      { path: 'change-password', component: MBuyerChangePasswordComponent },
      { path: 'pin-settings', component: MBuyerPinSettingsComponent },
      { path: 'deactivate', component: MBuyerDeleteAccountComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [],
  exports: [RouterModule],
})
export class BuyerMobileRoutingModule {}
