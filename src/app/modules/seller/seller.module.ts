import { SellerRoutingModule } from './seller-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'src/app/shared/pagination/ngx-pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewProductComponent } from '../landing/products/view-product/view-product.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { AddProductComponent } from './seller-product/add-product/add-product.component';
import { SellerProductComponent } from './seller-product/seller-product.component';
import { EditProductComponent } from './seller-product/edit-product/edit-product.component';
import { ProductItemComponent } from './seller-product/product-item/product-item.component';
import { ProductOptionComponent } from './seller-product/product-option/product-option.component';
import { ProductShipmentComponent } from './seller-product/product-shipment/product-shipment.component';
import { SearchItemComponent } from './seller-product/search-item/search-item.component';
import { ViewMoreComponent } from './seller-product/view-more/view-more.component';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safehtml.pipe';
import { SellerHeaderComponent } from './header/header.component';
import { SellerSidebarComponent } from './sidebar/sidebar.component';
import { OrderDetailComponent } from './seller-orders/order-detail/order-detail.component';
import { OrderListComponent } from './seller-orders/order-list/order-list.component';
import { OrderViewMoreComponent } from './seller-orders/order-view-more/order-view-more.component';
import { UpdateDeliveryStatusComponent } from './seller-orders/update-delivery-status/update-delivery-status.component';
import { SellerOrdersComponent } from './seller-orders/seller-orders.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';
import { SellerStoreComponent } from './seller-store/seller-store.component';
import { SellerShowCaseProductComponent } from './sellershowcaseproduct/seller-show-case-product/seller-show-case-product.component';
import { DashboardComponent } from './dashboard.component';
import { ProfileDashboardComponent } from './profile-dashboard/profile-dashboard.component';
import { ChangePasswordComponent } from './profile-dashboard/change-password/change-password.component';
import { ProfileComponent } from './profile-dashboard/profile/profile.component';

@NgModule({
  declarations: [
    SafeHtmlPipe,
    SellerHeaderComponent,
    SellerSidebarComponent,
    SellerDashboardComponent,
    SellerProductComponent,
    AddProductComponent,
    ViewProductComponent,
    EditProductComponent,
    OrderDetailComponent,
    OrderListComponent,
    OrderViewMoreComponent,
    UpdateDeliveryStatusComponent,
    SellerOrdersComponent,
    SellerHomeComponent,
    SellerStoreComponent,
    SellerShowCaseProductComponent,
    SellerSidebarComponent,
    DashboardComponent,
    ProfileDashboardComponent,
    ChangePasswordComponent,
    ProfileComponent,

    ViewMoreComponent,
    ProductItemComponent,
    ProductOptionComponent,
    ProductShipmentComponent,
    SearchItemComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SellerRoutingModule,
    SharedModule,
    NgxSliderModule,
    NgxPaginationModule,
    NgxSliderModule,
    MatPaginatorModule,
  ]
})
export class SellerModule { }
