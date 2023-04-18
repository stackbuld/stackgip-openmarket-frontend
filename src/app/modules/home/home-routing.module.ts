import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

const routes: Routes = [
    { path: '', component: HomeComponent, 
      children: [
        { path: '', component: ProductListComponent},
        { path: 'product/:id', component: SingleProductComponent},
        { path: 'checkout', component: ProductCheckoutComponent},
        { path: 'details', component: OrderDetailsComponent},
        { path: 'history', component: OrderHistoryComponent},
      ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
