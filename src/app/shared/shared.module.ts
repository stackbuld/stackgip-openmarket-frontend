import { SafeHtmlPipe } from 'src/app/shared/pipes/safehtml.pipe';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSliderModule } from "@angular/material/slider";
import { LoaderComponent } from "./components/loader/loader.component";
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from "@angular/material/form-field";
import { MatLabel } from "@angular/material/form-field";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HttpClientJsonpModule } from "@angular/common/http";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { SidebarHeaderDisplayComponent } from "./components/sidebar-header-display/sidebar-header-display.component";
import { WindowRefService } from "./services/window.service";
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
// import { ServicesComponent } from './components/services/services.component';
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
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatPaginatorModule,
    MatDialogModule
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
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "outline" },
    },
    WindowRefService,
  ],
})
export class SharedModule {}
