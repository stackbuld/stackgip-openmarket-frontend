import { SafeHtmlPipe } from 'src/app/shared/pipes/safehtml.pipe';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { LoaderComponent } from './components/loader/loader.component';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';

import { HttpClientJsonpModule } from '@angular/common/http';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SidebarHeaderDisplayComponent } from './components/sidebar-header-display/sidebar-header-display.component';
import { WindowRefService } from './services/window.service';
import { HeaderComponent } from './components/header/header.component';
import { SingleProductComponent } from '../modules/landing/products/single-product/single-product.component';
import { AddToCartComponent } from './components/add-to-cart/add-to-cart.component';
import { ProductsComponent } from '../modules/landing/products/products.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LayoutComponent } from './components/layout/layout.component';
import { SliderComponent } from './components/slider/slider.component';
import { NewProductListComponent } from './components/new-product-list/new-product-list.component';
import { InfiniteScrollComponent } from './infinite-scroll/Infinite-scroll.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SuccessfulDialogComponent } from './components/successful-dialog/successful-dialog.component';
import { HomeNavComponent } from './components/home-nav/home-nav.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { LandingFooterComponent } from './components/landing-footer/landing-footer.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { DataCardsComponent } from './components/data-cards/data-cards.component';
// import { ServicesComponent } from './components/services/services.component';
import { NgAisModule } from 'angular-instantsearch';
import { LazyLoadImagesDirective } from './directives/lazy-load-Images.directive';

import { InjectionToken } from '@angular/core';
import { LoginModalComponent } from './modals/login-modal/login-modal.component';
import { SignupModalComponent } from './modals/signup-modal/signup-modal.component';
import { SocialModalComponent } from './modals/social-modal/social-modal.component';
import { CustomDropdownComponent } from './components/custom-dropdown/custom-dropdown.component';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { NgOtpInputModule } from 'ng-otp-input';
import { PopupComponent } from './components/popup/popup.component';
import { LoginPopUpModalComponent } from './components/login-pop-up-modal/login-pop-up-modal.component';

export const DOCUMENT_TOKEN = new InjectionToken<Document>('Document');
export const WINDOW_TOKEN = new InjectionToken<Window>('Window');

@NgModule({
  declarations: [
    SafeHtmlPipe,
    LoaderComponent,
    SidebarHeaderDisplayComponent,
    NavbarComponent,
    FooterComponent,
    HeaderComponent,
    SingleProductComponent,
    AddToCartComponent,
    LayoutComponent,
    SliderComponent,
    NewProductListComponent,
    InfiniteScrollComponent,
    DeleteDialogComponent,
    ConfirmDialogComponent,
    SuccessfulDialogComponent,
    HomeNavComponent,
    ProductCardComponent,
    LandingFooterComponent,
    SearchBarComponent,
    DataCardsComponent,
    LazyLoadImagesDirective,
    LoginModalComponent,
    SignupModalComponent,
    SocialModalComponent,
    CustomDropdownComponent,
    PopupComponent,
    LoginPopUpModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatPaginatorModule,
    MatDialogModule,
    NgAisModule,
    NgOtpInputModule,
    MatAutocompleteModule,
    MatInputModule,
    NgxOtpInputModule,
  ],
  exports: [
    HttpClientJsonpModule,
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRippleModule,
    FormsModule,
    MatAutocompleteModule,
    NgxUiLoaderModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
    SidebarHeaderDisplayComponent,
    NavbarComponent,
    FooterComponent,
    HeaderComponent,
    SingleProductComponent,
    AddToCartComponent,
    SliderComponent,
    NewProductListComponent,
    InfiniteScrollComponent,
    SafeHtmlPipe,
    HomeNavComponent,
    ProductCardComponent,
    LandingFooterComponent,
    SearchBarComponent,
    DataCardsComponent,
    LazyLoadImagesDirective,
    LoginModalComponent,
    SignupModalComponent,
    SocialModalComponent,
    CustomDropdownComponent,
    LoginPopUpModalComponent
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    WindowRefService,
    {
      provide: DOCUMENT_TOKEN,
      useFactory: (platformId: any, document: any) => {
        if (isPlatformBrowser(platformId)) {
          return document;
        } else {
          return {};
        }
      },
      deps: [PLATFORM_ID, DOCUMENT],
    },
    {
      provide: WINDOW_TOKEN,
      useFactory: (platformId: any) => {
        if (isPlatformBrowser(platformId)) {
          return window;
        } else {
          return {};
        }
      },
      deps: [PLATFORM_ID],
    },
  ],
})
export class SharedModule {}
