import { SellerOrdersComponent } from "./components/seller/seller-orders/seller-orders.component";
import { SellerProductComponent } from "./components/seller/seller-product/seller-product.component";
import { SellerHomeComponent } from "./components/seller/seller-home/seller-home.component";
import { DashboardComponent } from "./components/seller/dashboard/dashboard.component";
import { AuthGuard } from "./guard/auth.guard";
import { ChangePasswordComponent } from "./components/profile-dashboard/change-password/change-password.component";
import { ProfileComponent } from "./components/profile-dashboard/profile/profile.component";
import { ProfileDashboardComponent } from "./components/profile-dashboard/profile-dashboard.component";
import { OrderInvoiceComponent } from "./components/order-invoice/order-invoice.component";
import { OrderComponent } from "./components/order/order.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { CartComponent } from "./components/cart/cart.component";
import { IndexComponent } from "./components/home/index/index.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ForgetPasswordComponent } from "./components/auth/forget-password/forget-password.component";
import { ResetPasswordComponent } from "./components/auth/reset-password/reset-password.component";
import { AccountConfirmationComponent } from "./components/auth/account-confirmation/account-confirmation.component";
import { LayoutComponent } from "./shared/components/layout/layout.component";
import { ListProductComponent } from "./components/home/list-product/list-product.component";
import { OrderListComponent } from "./components/seller/seller-orders/order-list/order-list.component";
import { OrderDetailComponent } from "./components/seller/seller-orders/order-detail/order-detail.component";
import { sellerApproveStatusApproveRouteResolver } from "./resolver/seller-status-approve.resolver";
import { SellerShowCaseProductComponent } from "./components/seller/sellershowcaseproduct/seller-show-case-product/seller-show-case-product.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { SiginupComponent } from "./components/auth/siginup/siginup.component";
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { HomeLandingComponent } from "./shared/components/home-landing/home-landing.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { OurservicesComponent } from "./shared/components/ourservices/ourservices.component";
import { PrivatePolicyComponent } from "./components/agreements/private-policy/private-policy.component";
import { TermsComponent } from "./components/agreements/terms/terms.component";
import { SellerAgreementComponent } from "./components/agreements/seller-agreement/seller-agreement.component";
import { FaqsComponent } from "./shared/components/faqs/faqs.component";
import { ContactComponent } from "./shared/components/contact/contact.component";
import { FeaturesComponent } from "./shared/components/features/features.component";
import { SellerStoreComponent } from "./components/seller/seller-store/seller-store.component";

const route: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "", component: IndexComponent },
      // { path: "home", component: IndexComponent },
      { path: "forget-password", component: ForgetPasswordComponent },
      { path: "confirm-email", component: AccountConfirmationComponent },
      { path: "confirm", component: AccountConfirmationComponent },
      { path: "reset-password", component: ResetPasswordComponent },
      { path: "ResetPassword", component: ResetPasswordComponent },
      { path: "cart", component: CartComponent },
      { path: "checkout", component: CheckoutComponent },
      { path: "orders", component: OrderComponent, canActivate: [AuthGuard] },
      { path: "products", component: ListProductComponent },
      {
        path: "order/:id",
        component: OrderInvoiceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "profile",
        canActivate: [AuthGuard],
        component: ProfileDashboardComponent,
        children: [
          {
            path: "",
            component: ProfileComponent,
          },
          {
            path: "my",
            component: ProfileComponent,
          },
          {
            path: "manage-account",
            component: ChangePasswordComponent,
          },
        ],
      },
      {
        path: "sellerproduct/:sellerId",
        component: SellerShowCaseProductComponent,
      },
    ],
  },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SiginupComponent },
  { path: "navbar", component: NavbarComponent },
  { path: "landing", component: HomeLandingComponent },
  { path: "footer", component: FooterComponent },
  { path: "ourservices", component: OurservicesComponent },
  { path: "private-policy", component: PrivatePolicyComponent },
  { path: "seller-agreement", component: SellerAgreementComponent },
  { path: "terms", component: TermsComponent },
  { path: "faqs", component: FaqsComponent },
  { path: "contact", component: ContactComponent },
  { path: "features", component: FeaturesComponent },
  {
    path: "seller",
    canActivate: [AuthGuard],
    component: DashboardComponent,
    resolve: { data: sellerApproveStatusApproveRouteResolver },
    children: [
      {
        path: "",
        component: SellerHomeComponent,
      },
      {
        path: "dashboard",
        component: SellerHomeComponent,
      },
      {
        path: "products",
        component: SellerProductComponent,
      },

      {
        path: "orders",
        component: SellerOrdersComponent,
        children: [
          {
            path: "",
            component: OrderListComponent,
          },
          {
            path: "detail/:id/:user_id",
            component: OrderDetailComponent,
          },
        ],
      },
      {
        path: "store",
        component: SellerStoreComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(route, { enableTracing: true }), CommonModule],
  exports: [RouterModule],
})
export class AppRouteModule {}
