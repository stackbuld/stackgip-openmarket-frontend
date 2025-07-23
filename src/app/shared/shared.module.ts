import { NgModule, PLATFORM_ID, InjectionToken, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SafeHtmlPipe } from 'src/app/shared/pipes/safehtml.pipe';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SidebarHeaderDisplayComponent } from './components/sidebar-header-display/sidebar-header-display.component';
import { HeaderComponent } from './components/header/header.component';
import { SingleProductComponent } from '../modules/landing/products/single-product/single-product.component';
import { AddToCartComponent } from './components/add-to-cart/add-to-cart.component';
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
import { LazyLoadImagesDirective } from './directives/lazy-load-Images.directive';
import { LoginModalComponent } from './modals/login-modal/login-modal.component';
import { SocialModalComponent } from './modals/social-modal/social-modal.component';
import { CustomDropdownComponent } from './components/custom-dropdown/custom-dropdown.component';
import { PopupComponent } from './components/popup/popup.component';
import { LoginPopUpModalComponent } from './components/login-pop-up-modal/login-pop-up-modal.component';
import { SignupModule } from './components/signup-component/signup.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatRippleModule } from '@angular/material/core';
import { MAT_SELECT_CONFIG, MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { NgOtpInputModule } from 'ng-otp-input';
import { OnVisibleDirective } from './directives/on-visible.directive';
import { DemoNgZorroAntdModule } from '../modules/seller/seller-store/ng-zoro.module';
import { LogoutModalComponent } from './components/logout-modal/logout-modal.component';
import { WalletKycPromptComponent } from './wallet/wallet-kyc-prompt/wallet-kyc-prompt.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { PwaPromptComponent } from './components/pwa-prompt/pwa-prompt.component';
import { AppShellRenderDirective } from '../directives/app-shell-render.directive';
import { WindowRefService } from './services/window.service';
import { UploadImageComponent } from './components/image-upload/upload-image.component'

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
    SocialModalComponent,
    CustomDropdownComponent,
    PopupComponent,
    LoginPopUpModalComponent,
    OnVisibleDirective,
    LogoutModalComponent,
    WalletKycPromptComponent,
    LoadingSpinnerComponent,
    PwaPromptComponent,
    AppShellRenderDirective,
    UploadImageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatPaginatorModule,
    MatDialogModule,
    MatMenuModule,
    // NgAisModule, // ❌ Remove this line
    NgOtpInputModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    NgxOtpInputModule,
    SignupModule,
    NgOptimizedImage
  ],
  exports: [
    HttpClientJsonpModule,
    MatMenuModule,
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
    MatMenuModule,
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
    SocialModalComponent,
    CustomDropdownComponent,
    LoginPopUpModalComponent,
    MatExpansionModule,
    DemoNgZorroAntdModule,
    LoadingSpinnerComponent,
    AppShellRenderDirective,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    WindowRefService,
    {
      provide: DOCUMENT_TOKEN,
      useFactory: (platformId: any, document: any) => {
        return isPlatformBrowser(platformId) ? document : {};
      },
      deps: [PLATFORM_ID, DOCUMENT],
    },
    {
      provide: WINDOW_TOKEN,
      useFactory: (platformId: any) => {
        return isPlatformBrowser(platformId) ? window : {};
      },
      deps: [PLATFORM_ID],
    },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'matSelectCustom' },
    },
  ],
})
export class SharedModule {}
