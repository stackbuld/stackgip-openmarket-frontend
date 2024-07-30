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
import { CreateProductComponent } from './create-product/create-product.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { VideoGuidePromptComponent } from '../../../shared/components/video-guide-prompt/video-guide-prompt.component';
import { VariantComponent } from './create-product/variant/variant.component';
import { ProductPreview } from './create-product/preview-product/preview-product';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DeleteProductConfirmation } from './create-product/preview-product/delete-product';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safehtml.pipe';

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
    CreateProductComponent,
    DeleteProductConfirmation,
    ProductPreview,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
    ButtonModule,
    DialogModule,
    AutoCompleteModule,
    InventoryRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSliderModule,
    NgxPaginationModule,
    NgxSliderModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    AngularEditorModule,
    NgxPageScrollCoreModule.forRoot({ duration: 2500, scrollInView: false }),
    VideoGuidePromptComponent,
    VariantComponent,
  ],
  providers: [SafeHtmlPipe],
})
export class InventoryModule {}
