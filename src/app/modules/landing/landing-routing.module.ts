import { LandingComponent } from './landing.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeLandingComponent } from './home-landing/home-landing.component';
import { ContactComponent } from 'src/app/modules/landing/contact/contact.component';
import { FaqsComponent } from 'src/app/modules/landing/faqs/faqs.component';
import { FeaturesComponent } from 'src/app/modules/landing/features/features.component';
import { JoinWaitlistComponent } from 'src/app/modules/landing/join-waitlist/join-waitlist.component';
import { MarketPlaceComponent } from 'src/app/modules/landing/market-place/market-place.component';
import { OurservicesComponent } from 'src/app/modules/landing/ourservices/ourservices.component';
import { SuccessModalComponent } from 'src/app/modules/landing/success-modal/success-modal.component';
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
import { AuthGuard } from 'src/app/guard/auth.guard';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
    { path: '', component: LandingComponent, 
      children: [
        { path: '', component: HomeLandingComponent},
        { path: 'learn-more', component: HomeLandingComponent},
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
        { path: 'cart', component: CartComponent },
        { path: 'checkout', component: CheckoutComponent },
        { path: 'home', component: IndexComponent },
        { path: 'products', component: ListProductComponent },
        { path: 'seller-form', component: SellerRegisterationFormComponent},
        { path: 'orders', component: OrderComponent, canActivate: [AuthGuard] },
        { path: 'order/:id', component: OrderInvoiceComponent, canActivate: [AuthGuard] },
      ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
