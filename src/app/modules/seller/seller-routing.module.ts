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
import { AddProductComponent } from './seller-product/add-product/add-product.component';
import { SellerProductComponent } from './seller-product/seller-product.component';
import { SellerStoreComponent } from './seller-store/seller-store.component';
import { SellerShowCaseProductComponent } from './sellershowcaseproduct/seller-show-case-product/seller-show-case-product.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, 
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: SellerDashboardComponent },
        {
          path: 'products',
          children: [
            {
              path: '',
              component: SellerProductComponent,
            },
            {
              path: 'add',
              component: AddProductComponent,
            },
            {
              path: 'add/:id',
              component: AddProductComponent,
            },
            {
              path: 'view/:id',
              component: ViewProductComponent,
            },
          ],
        },
        {
          path: 'orders',
          component: SellerOrdersComponent,
          children: [
            {
              path: '',
              component: OrderListComponent,
            },
            // {
            //   path: "detail/:id/:user_id",
            //   component: OrderDetailComponent,
            // },
          ],
        },
        {
          path: 'store',
          component: SellerStoreComponent,
        },
        {
          path: 'sellerproduct/:sellerId',
          component: SellerShowCaseProductComponent,
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
      ]
    },
    {
      path: '**',
      redirectTo: '/seller/dashboard',
    },
];

// {
//   path: 'seller',
//   canActivate: [AuthGuard],
//   component: DashboardComponent,
//   resolve: { data: sellerApproveStatusApproveRouteResolver },
//   children: [
//     {
//       path: '',
//       component: SellerDashboardComponent,
//     },
//     {
//       path: 'dashboard',
//       component: SellerDashboardComponent,
//     },
    // {
    //   path: 'products',
    //   // component: SellerProductComponent,
    //   children: [
    //     {
    //       path: '',
    //       component: SellerProductComponent,
    //     },
    //     {
    //       path: 'add',
    //       component: AddProductComponent,
    //     },
    //     {
    //       path: 'add/:id',
    //       component: AddProductComponent,
    //     },
    //     {
    //       path: 'view/:id',
    //       component: ViewProductComponent,
    //     },
    //   ],
    // },
//     {
//       path: 'orders',
//       component: SellerOrdersComponent,
//       children: [
//         {
//           path: '',
//           component: OrderListComponent,
//         },
//         // {
//         //   path: "detail/:id/:user_id",
//         //   component: OrderDetailComponent,
//         // },
//       ],
//     },
//     {
//       path: 'store',
//       component: SellerStoreComponent,
//     },
//   ],
// },

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerRoutingModule {}
