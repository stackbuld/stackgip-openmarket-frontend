import { AddProductComponent } from './modules/seller/seller-product/add-product/add-product.component';
import { SellerOrdersComponent } from './modules/seller/seller-orders/seller-orders.component';
import { SellerProductComponent } from './modules/seller/seller-product/seller-product.component';
import { SellerHomeComponent } from './modules/seller/seller-home/seller-home.component';
import { DashboardComponent } from './modules/seller/dashboard.component';
import { AuthGuard } from './guard/auth.guard';
import { ChangePasswordComponent } from './modules/seller/profile-dashboard/change-password/change-password.component';
import { ProfileComponent } from './modules/seller/profile-dashboard/profile/profile.component';
import { ProfileDashboardComponent } from './modules/seller/profile-dashboard/profile-dashboard.component';
import { OrderInvoiceComponent } from './shared/components/order-invoice/order-invoice.component';
import { OrderComponent } from './modules/landing/order/order.component';
import { CheckoutComponent } from './modules/landing/checkout/checkout.component';
import { CartComponent } from './modules/landing/cart/cart.component';
import { IndexComponent } from './modules/landing/index/index.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgetPasswordComponent } from './modules/auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';
import { AccountConfirmationComponent } from './modules/auth/account-confirmation/account-confirmation.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { ListProductComponent } from './modules/landing/list-product/list-product.component';
import { OrderListComponent } from './modules/seller/seller-orders/order-list/order-list.component';
import { OrderDetailComponent } from './modules/seller/seller-orders/order-detail/order-detail.component';
import { sellerApproveStatusApproveRouteResolver } from './resolver/seller-status-approve.resolver';
import { SellerShowCaseProductComponent } from './modules/seller/sellershowcaseproduct/seller-show-case-product/seller-show-case-product.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { SiginupComponent } from './modules/auth/siginup/siginup.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { HomeLandingComponent } from './modules/landing/home-landing/home-landing.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { OurservicesComponent } from './modules/landing/ourservices/ourservices.component';
import { PrivatePolicyComponent } from './modules/landing/private-policy/private-policy.component';
import { TermsComponent } from './modules/landing/terms/terms.component';
import { SellerAgreementComponent } from './modules/landing/seller-agreement/seller-agreement.component';
import { FaqsComponent } from './modules/landing/faqs/faqs.component';
import { ContactComponent } from './modules/landing/contact/contact.component';
import { FeaturesComponent } from './modules/landing/features/features.component';
import { SellerStoreComponent } from './modules/seller/seller-store/seller-store.component';
import { SellerDashboardComponent } from './modules/seller/seller-dashboard/seller-dashboard.component';
import { JoinWaitlistComponent } from './modules/landing/join-waitlist/join-waitlist.component';
import { SuccessModalComponent } from './modules/landing/success-modal/success-modal.component';
import { MarketPlaceComponent } from './modules/landing/market-place/market-place.component';
import { ViewProductComponent } from './modules/landing/products/view-product/view-product.component';

const route: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/landing/landing.module').then(
        (m) => m.LandingModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(
        (m) => m.AuthModule
      ),
  },
  {
    path: 'seller',
    loadChildren: () =>
      import('./modules/seller/seller.module').then(
        (m) => m.SellerModule
      ), canActivate: [AuthGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      // { path: '', component: HomeLandingComponent },
      // { path: 'landing', component: HomeLandingComponent },
      // { path: 'home', component: IndexComponent },
      // { path: 'forget-password', component: ForgetPasswordComponent },
      // { path: 'confirm-email', component: AccountConfirmationComponent },
      // { path: 'confirm', component: AccountConfirmationComponent },
      // { path: 'reset-password', component: ResetPasswordComponent },
      // { path: 'ResetPassword', component: ResetPasswordComponent },


      // { path: 'cart', component: CartComponent },
      // { path: 'checkout', component: CheckoutComponent },
      // { path: 'home', component: IndexComponent },
      // { path: 'products', component: ListProductComponent },
      // { path: 'orders', component: OrderComponent, canActivate: [AuthGuard] },
      
      // {
      //   path: 'order/:id',
      //   component: OrderInvoiceComponent,
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'profile',
      //   canActivate: [AuthGuard],
      //   component: ProfileDashboardComponent,
      //   children: [
      //     {
      //       path: '',
      //       component: ProfileComponent,
      //     },
      //     {
      //       path: 'my',
      //       component: ProfileComponent,
      //     },
      //     {
      //       path: 'manage-account',
      //       component: ChangePasswordComponent,
      //     },
      //   ],
      // },
      // {
      //   path: 'sellerproduct/:sellerId',
      //   component: SellerShowCaseProductComponent,
      // },
    ],
  },

  // { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SiginupComponent },
  // { path: 'navbar', component: NavbarComponent },
  // { path: 'landing', component: HomeLandingComponent },
  // { path: 'footer', component: FooterComponent },


  
  // { path: 'ourservices', component: OurservicesComponent },
  // { path: 'private-policy', component: PrivatePolicyComponent },
  // { path: 'seller-agreement', component: SellerAgreementComponent },
  // { path: 'terms', component: TermsComponent },
  // { path: 'faqs', component: FaqsComponent },
  // { path: 'contact', component: ContactComponent },
  // { path: 'features', component: FeaturesComponent },
  // { path: 'market-place', component: MarketPlaceComponent },
  // { path: 'wait-list', component: JoinWaitlistComponent },
  // { path: 'join', component: SuccessModalComponent },
  // { path: 'detail', component: OrderDetailComponent },
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
  //     {
  //       path: 'products',
  //       // component: SellerProductComponent,
  //       children: [
  //         {
  //           path: '',
  //           component: SellerProductComponent,
  //         },
  //         {
  //           path: 'add',
  //           component: AddProductComponent,
  //         },
  //         {
  //           path: 'add/:id',
  //           component: AddProductComponent,
  //         },
  //         {
  //           path: 'view/:id',
  //           component: ViewProductComponent,
  //         },
  //       ],
  //     },
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
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(route, {
      enableTracing: true,
      initialNavigation: 'enabledBlocking',
    }),
    CommonModule,
  ],
  exports: [RouterModule],
})
export class AppRouteModule {}
