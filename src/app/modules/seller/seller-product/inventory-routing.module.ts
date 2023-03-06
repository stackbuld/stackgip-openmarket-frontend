import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewProductComponent } from '../../landing/products/view-product/view-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { SellerProductComponent } from './seller-product.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SellerProductComponent,
      },
      {
        path: 'add',
        component: AddProductComponent,
      },
      {
        path: 'add/:id',
        component: AddProductComponent,
      },
      {
        path: 'view/:id',
        component: ViewProductComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
