import { LandingRoutingModule } from './landing-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'src/app/shared/pagination/ngx-pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeLandingComponent } from './home-landing/home-landing.component';
import { LandingComponent } from './landing.component';
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
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ListProductComponent } from './list-product/list-product.component';
import { OrderDetailComponent } from '../seller/seller-orders/order-detail/order-detail.component';
import { SellerRegisterationFormComponent } from './seller-registeration-form/seller-registeration-form.component';
import { OrderComponent } from './order/order.component';
import { OrderInvoiceComponent } from '../../shared/components/order-invoice/order-invoice.component';
import { IndexComponent } from './index/index.component';
import { ProductsComponent } from './products/products.component';
import { CategoryProductsComponent } from './products/category-products/category-products.component';
import { CategoryHomeGridComponent } from './category-home-grid/category-home-grid.component';

@NgModule({
  declarations: [
    LandingComponent,
    HomeLandingComponent,
    OurservicesComponent,
    PrivatePolicyComponent,
    SellerAgreementComponent,
    TermsComponent,
    FaqsComponent,
    ContactComponent,
    FeaturesComponent,
    MarketPlaceComponent,
    JoinWaitlistComponent,
    SuccessModalComponent,
    CartComponent,
    CheckoutComponent,
    OrderComponent,
    OrderInvoiceComponent,
    ListProductComponent,
    SellerRegisterationFormComponent,
    IndexComponent,
    ProductsComponent,
    CategoryProductsComponent,
    CategoryHomeGridComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LandingRoutingModule,
    SharedModule,
    NgxSliderModule,
    NgxPaginationModule,
    NgxSliderModule,
    MatPaginatorModule,
  ]
})
export class LandingModule { }
