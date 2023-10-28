import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'src/app/shared/pagination/ngx-pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductListComponent } from './product-list/product-list.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { ProductAddToCartComponent } from './product-add-to-cart/product-add-to-cart.component';
import { DeliveryInformationComponent } from './product-add-to-cart/delivery-information/delivery-information.component';
import { ShippingMethodComponent } from './product-add-to-cart/shipping-method/shipping-method.component';
import { ComplimentaryProductsComponent } from './product-add-to-cart/complimentary-products/complimentary-products.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
@NgModule({
  declarations: [
    HomeComponent,
    ProductListComponent,
    SingleProductComponent,
    ProductCheckoutComponent,
    OrderDetailsComponent,
    OrderHistoryComponent,
    PaymentConfirmationComponent,
    ProductAddToCartComponent,
    DeliveryInformationComponent,
    ShippingMethodComponent,
    ComplimentaryProductsComponent,
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
  ],
})
export class HomeModule {}
