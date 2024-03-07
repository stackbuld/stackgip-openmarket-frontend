import { SellerRoutingModule } from './seller-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'src/app/shared/pagination/ngx-pagination.module';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatTabsModule } from '@angular/material/tabs';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';

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
import { SellerProfileSettingsComponent } from './profile-dashboard/seller-profile-settings/seller-profile-settings.component';
import { ProfileComponent } from './profile-dashboard/profile/profile.component';
import { BankAccountListComponent } from './bank-account/bank-account-list/bank-account-list.component';
import { BankAccountCreateDialogComponent } from './bank-account/bank-account-create-dialog/bank-account-create-dialog.component';
import { WithdrawalDialogComponent } from './bank-account/withdrawal-dialog/withdrawal-dialog.component';
import { OrderManagementComponent } from './order-management/order-management/order-management.component';
import { OrderViewComponent } from './order-management/order-view/order-view.component';
import { ConfirmOrderDialogComponent } from './order-management/confirm-order-dialog/confirm-order-dialog.component';
import { BusinessProfileComponent } from './profile-dashboard/business-profile/business-profile.component';
import { SellerKycComponent } from './profile-dashboard/seller-kyc/seller-kyc.component';
import { OTPDialogComponent } from './profile-dashboard/otp-dialog/otp-dialog.component';
import { EmailDialogComponent } from './profile-dashboard/email-dialog/email-dialog.component';
import { SellerProductSearchComponent } from './seller-product-search/seller-product-search.component';
import { ProductSearchImageDirective } from './seller-product-search/product-search-image.directive';
import { OrderStatusDirective } from './order-management/order-management/order-status.directive';
import { DeliveryStatusDirective } from './order-management/order-management/delivery-status.directive';
import {VideoGuidePromptComponent} from "../../shared/components/video-guide-prompt/video-guide-prompt.component";

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
    SellerProfileSettingsComponent,
    ProfileComponent,
    BankAccountListComponent,
    BankAccountCreateDialogComponent,
    WithdrawalDialogComponent,
    OrderManagementComponent,
    OrderViewComponent,
    ConfirmOrderDialogComponent,
    BusinessProfileComponent,
    SellerKycComponent,
    OTPDialogComponent,
    EmailDialogComponent,
    SellerProductSearchComponent,
    ProductSearchImageDirective,
    OrderStatusDirective,
    DeliveryStatusDirective,
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
    Ng2TelInputModule,
    NgOtpInputModule,
    MatTabsModule,
    IvyCarouselModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    VideoGuidePromptComponent,
  ],
})
export class SellerModule {}
