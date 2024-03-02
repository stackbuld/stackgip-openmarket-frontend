import { LandingRoutingModule } from './landing-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'src/app/shared/pagination/ngx-pagination.module';
import { YouTubePlayerModule } from '@angular/youtube-player';
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
import { SellerRegisterationFormComponent } from './seller-registeration-form/seller-registeration-form.component';
import { OrderComponent } from './order/order.component';
import { OrderInvoiceComponent } from '../../shared/components/order-invoice/order-invoice.component';
import { IndexComponent } from './index/index.component';
import { ProductsComponent } from './products/products.component';
import { CategoryProductsComponent } from './products/category-products/category-products.component';
import { CategoryHomeGridComponent } from './category-home-grid/category-home-grid.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { VideoGuideComponent } from './video-guide/video-guide.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    CategoryHomeGridComponent,
    VideoGuideComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LandingRoutingModule,
    SharedModule,
    NgxSliderModule,
    MatDatepickerModule,
    NgxPaginationModule,
    MatPaginatorModule,
    GooglePlaceModule,
    YouTubePlayerModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class LandingModule {}
