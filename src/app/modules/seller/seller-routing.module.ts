import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewProductComponent } from '../landing/products/view-product/view-product.component';
import { ChangePasswordComponent } from './profile-dashboard/change-password/change-password.component';
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

const routes: Routes = [
  { path: '', component: DashboardComponent,
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
              path: "detail/:id",
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
              component: ProfileComponent,
            },
            {
              path: 'my',
              component: ProfileComponent,
            },
            {
              path: 'manage-account',
              component: ChangePasswordComponent,
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
      ]
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
