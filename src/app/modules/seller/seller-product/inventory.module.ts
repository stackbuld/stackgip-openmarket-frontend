import { EditProductComponent } from './edit-product/edit-product.component';
import { ViewProductComponent } from './../../landing/products/view-product/view-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { SellerProductComponent } from './seller-product.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'src/app/shared/pagination/ngx-pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductOptionComponent } from './product-option/product-option.component';
import { SearchItemComponent } from './search-item/search-item.component';
import { ViewMoreComponent } from './view-more/view-more.component';
import { ProductShipmentComponent } from './product-shipment/product-shipment.component';

@NgModule({
  declarations: [
    SellerProductComponent,
    AddProductComponent,
    ViewProductComponent,
    EditProductComponent,
    ProductShipmentComponent,
    SearchItemComponent,
    ProductOptionComponent,
    ProductItemComponent,
    ViewMoreComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    InventoryRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSliderModule,
    NgxPaginationModule,
    NgxSliderModule,
    MatPaginatorModule,
  ],
})
export class InventoryModule {}
