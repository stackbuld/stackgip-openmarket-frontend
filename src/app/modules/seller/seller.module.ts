import { SellerRoutingModule } from './seller-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'src/app/shared/pagination/ngx-pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { SellerHeaderComponent } from './header/header.component';
import { SellerSidebarComponent } from './sidebar/sidebar.component';
import { OrderDetailComponent } from './seller-orders/order-detail/order-detail.component';
import { OrderListComponent } from './seller-orders/order-list/order-list.component';
import { OrderViewMoreComponent } from './seller-orders/order-view-more/order-view-more.component';
import { UpdateDeliveryStatusComponent } from './seller-orders/update-delivery-status/update-delivery-status.component';
import { SellerOrdersComponent } from './seller-orders/seller-orders.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';
import { SellerShowCaseProductComponent } from './sellershowcaseproduct/seller-show-case-product/seller-show-case-product.component';
import { DashboardComponent } from './dashboard.component';
import { ProfileDashboardComponent } from './profile-dashboard/profile-dashboard.component';
import { ChangePasswordComponent } from './profile-dashboard/change-password/change-password.component';
import { ProfileComponent } from './profile-dashboard/profile/profile.component';

@NgModule({
  declarations: [
    SellerHeaderComponent,
    SellerSidebarComponent,
    SellerDashboardComponent,
    OrderDetailComponent,
    OrderListComponent,
    OrderViewMoreComponent,
    UpdateDeliveryStatusComponent,
    SellerOrdersComponent,
    SellerHomeComponent,
    SellerShowCaseProductComponent,
    SellerSidebarComponent,
    DashboardComponent,
    ProfileDashboardComponent,
    ChangePasswordComponent,
    ProfileComponent,
    
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
