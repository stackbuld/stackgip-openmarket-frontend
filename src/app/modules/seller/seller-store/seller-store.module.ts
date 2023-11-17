import { SellerStoreRoutingModule } from './seller-store-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'src/app/shared/pagination/ngx-pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SellerStoreComponent } from './seller-store/seller-store.component';
import { SellerStoreCreateDialogComponent } from './seller-store-create-dialog/seller-store-create-dialog.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [SellerStoreComponent, SellerStoreCreateDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SellerStoreRoutingModule,
    NgxSliderModule,
    NgxPaginationModule,
    NgxSliderModule,
    MatPaginatorModule,
    GooglePlaceModule,
    NgxMaterialTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    MatNativeDateModule,
  ],
})
export class SellerStoreModule {}
