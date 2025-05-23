import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyerPersonalInformationComponent } from './buyer-profile/buyer-personal-information/buyer-personal-information.component';
import { BuyerContactInformationComponent } from './buyer-profile/buyer-contact-information/buyer-contact-information.component';
import { BuyerAddressInformationComponent } from './buyer-profile/buyer-address-information/buyer-address-information.component';
import { BuyerChangePasswordComponent } from './buyer-security-settings/buyer-change-password/buyer-change-password.component';
import { BuyerPinSettingsComponent } from './buyer-security-settings/buyer-pin-settings/buyer-pin-settings.component';
import { BuyerDeleteAccountComponent } from './buyer-deactivate/buyer-delete-account/buyer-delete-account.component';
import { BuyerComponent } from './buyer.component';
import { BuyerProfileComponent } from './buyer-profile/buyer-profile.component';
import { BuyerSecuritySettingsComponent } from './buyer-security-settings/buyer-security-settings.component';
import { BuyerDeactivateComponent } from './buyer-deactivate/buyer-deactivate.component';
import { BuyerSidebarComponent } from './buyer-sidebar/buyer-sidebar.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {
    path: 'profile',
    component: BuyerComponent,
    children: [
      {
        path: '',
        redirectTo: window.screen.width < 920 ? '' : 'personal-information',
        pathMatch: 'full',
      },
      { path: '', component: BuyerSidebarComponent, outlet: 'side' },
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
          {
            path: 'wallet',
            loadChildren: () =>
              import('../../shared/wallet/wallet.module').then(
                (m) => m.WalletModule,
              ),
          },
          {
            path: 'transaction-history',
            loadComponent: () =>
              import(
                '../../shared/components/transactions/transactions.component'
              ).then((m) => m.TransactionsComponent),
          },
        ],
      },

      {
        path: '',
        component: BuyerSecuritySettingsComponent,
        children: [
          { path: 'change-password', component: BuyerChangePasswordComponent },
          { path: 'pin-settings', component: BuyerPinSettingsComponent },
        ],
      },

      {
        path: '',
        component: BuyerDeactivateComponent,
        children: [
          { path: 'deactivate', component: BuyerDeleteAccountComponent },
        ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyerRoutingModule {}
