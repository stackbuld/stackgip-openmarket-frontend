import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'src/app/shared/pagination/ngx-pagination.module';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProductListComponent } from './product-list/product-list.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { SellerStorefrontComponent } from './seller-storefront/seller-storefront.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RequestRefundModalComponent } from './order-details/request-refund-modal/request-refund-modal.component';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { ProductDeleteModalComponent } from './product-checkout/product-delete-modal/product-delete-modal.component';
import { SingleProductAddressDialogComponent } from './single-product/single-product-address-dialog/single-product-address-dialog.component';

import { register } from 'swiper/element/bundle';
import {
  NgAisHitsModule,
  NgAisInstantSearchModule,
  NgAisSearchBoxModule,
} from 'angular-instantsearch';
if(isPlatformBrowser(PLATFORM_ID)) {
  register();
}

@NgModule({
  declarations: [
    HomeComponent,
    ProductListComponent,
    SingleProductComponent,
    ProductCheckoutComponent,
    OrderDetailsComponent,
    OrderHistoryComponent,
    PaymentConfirmationComponent,
    SellerStorefrontComponent,
    HomePageComponent,
    RequestRefundModalComponent,
    ProductDeleteModalComponent,
    SingleProductAddressDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    SharedModule,
    NgxOtpInputModule,
    NgxPaginationModule,
    NgxSliderModule,
    MatPaginatorModule,
    NgxShimmerLoadingModule,
    GooglePlaceModule,
    IvyCarouselModule,
    NgImageFullscreenViewModule,
    NgAisSearchBoxModule,
    NgAisInstantSearchModule,
    NgAisHitsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'matSelectCustom2' },
    },
  ],
})
export class HomeModule {}
