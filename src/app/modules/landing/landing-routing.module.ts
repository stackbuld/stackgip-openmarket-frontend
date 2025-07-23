import { LandingComponent } from './landing.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeLandingComponent } from './home-landing/home-landing.component';
import { ContactComponent } from '../../modules/landing/contact/contact.component';
import { FaqsComponent } from '../../modules/landing/faqs/faqs.component';
import { FeaturesComponent } from '../../modules/landing/features/features.component';
import { JoinWaitlistComponent } from '../../modules/landing/join-waitlist/join-waitlist.component';
import { MarketPlaceComponent } from '../../modules/landing/market-place/market-place.component';
import { OurservicesComponent } from '../../modules/landing/ourservices/ourservices.component';
import { SuccessModalComponent } from '../../modules/landing/success-modal/success-modal.component';
import { PrivatePolicyComponent } from './private-policy/private-policy.component';
import { SellerAgreementComponent } from './seller-agreement/seller-agreement.component';
import { TermsComponent } from './terms/terms.component';
import { OrderDetailComponent } from '../seller/seller-orders/order-detail/order-detail.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { IndexComponent } from './index/index.component';
import { ListProductComponent } from './list-product/list-product.component';
import { SellerRegisterationFormComponent } from './seller-registeration-form/seller-registeration-form.component';
import { OrderInvoiceComponent } from '../../shared/components/order-invoice/order-invoice.component';
import { AuthGuard } from '../../guard/auth.guard';
import { OrderComponent } from './order/order.component';

import {
  learnMoreRedirectGuard,
  cartRedirectGuard,
  sellerFormRedirectGuard,

} from '../../guard/redirects.guard';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: '',
        component: HomeLandingComponent,
      },
      {
        path: 'learn-more',
        component: HomeLandingComponent,
        canActivate: [learnMoreRedirectGuard],
      },
      { path: 'ourservices', component: OurservicesComponent },
      { path: 'private-policy', component: PrivatePolicyComponent },
      { path: 'seller-agreement', component: SellerAgreementComponent },
      { path: 'terms', component: TermsComponent },
      { path: 'faqs', component: FaqsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'features', component: FeaturesComponent },
      { path: 'market-place', component: MarketPlaceComponent },
      { path: 'wait-list', component: JoinWaitlistComponent },
      { path: 'join', component: SuccessModalComponent },
      {
        path: 'cart',
        component: CartComponent,
        canActivate: [cartRedirectGuard],
      },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'home', component: IndexComponent },
      { path: 'products', component: ListProductComponent },
      {
        path: 'seller-form',
        component: SellerRegisterationFormComponent,
        canActivate: [sellerFormRedirectGuard],
      },
      { path: 'orders', component: OrderComponent, canActivate: [AuthGuard] },
      {
        path: 'order/:id',
        component: OrderInvoiceComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
