import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewProductComponent } from '../landing/products/view-product/view-product.component';
import { SellerProfileSettingsComponent } from './profile-dashboard/seller-profile-settings/seller-profile-settings.component';
import { ProfileDashboardComponent } from './profile-dashboard/profile-dashboard.component';
import { ProfileComponent } from './profile-dashboard/profile/profile.component';
import { DashboardComponent } from './dashboard.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { OrderListComponent } from './seller-orders/order-list/order-list.component';
import { SellerOrdersComponent } from './seller-orders/seller-orders.component';
import { SellerShowCaseProductComponent } from './sellershowcaseproduct/seller-show-case-product/seller-show-case-product.component';
import { BankAccountListComponent } from './bank-account/bank-account-list/bank-account-list.component';
import { OrderManagementComponent } from './order-management/order-management/order-management.component';
import { OrderViewComponent } from './order-management/order-view/order-view.component';
import { SellerKycComponent } from './profile-dashboard/seller-kyc/seller-kyc.component';
import { BusinessProfileComponent } from './profile-dashboard/business-profile/business-profile.component';
// import { SellerWalletComponent } from './seller-wallet/seller-wallet.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: SellerDashboardComponent },
      {
        path: 'orders',
        component: SellerOrdersComponent,
        children: [
          {
            path: '',
            component: OrderManagementComponent,
            // component: OrderListComponent,
          },
          {
            // path: "detail/:id/:user_id",
            path: 'detail/:id',
            component: OrderViewComponent,
          },
        ],
      },
      {
        path: 'sellerproduct/:sellerId',
        component: SellerShowCaseProductComponent,
      },
      {
        path: 'bank-account-list',
        component: BankAccountListComponent,
      },
      {
        path: 'order-management',
        component: OrderManagementComponent,
      },
      {
        path: 'profile',
        component: ProfileDashboardComponent,
        children: [
          {
            path: '',
            redirectTo: 'personal-information',
            pathMatch: 'full',
          },
          {
            path: 'personal-information',
            component: ProfileComponent,
          },
          {
            path: 'settings',
            component: SellerProfileSettingsComponent,
          },
          {
            path: 'kyc-verification',
            component: SellerKycComponent,
          },
          {
            path: 'business-information',
            component: BusinessProfileComponent,
          },
        ],
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./seller-product/inventory.module').then(
            (m) => m.InventoryModule
          ),
      },
      {
        path: 'store',
        loadChildren: () =>
          import('./seller-store/seller-store.module').then(
            (m) => m.SellerStoreModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/seller/dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerRoutingModule {}
