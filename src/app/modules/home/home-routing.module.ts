import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { ProductAddToCartComponent } from './product-add-to-cart/product-add-to-cart.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: ProductListComponent },
      // { path: 'product/:id', component: ProductAddToCartComponent },
      { path: 'product/:id', component: SingleProductComponent },
      { path: 'checkout', component: ProductCheckoutComponent },
      { path: 'details/:id', component: OrderDetailsComponent },
      { path: 'history', component: OrderHistoryComponent },
      { path: 'payment-confirmation', component: PaymentConfirmationComponent },
      {
        path: 'wallet',
        loadChildren: () =>
          import('../../shared/wallet/wallet.module').then(
            (m) => m.WalletModule
          ),
      },
      {
        path: '**',
        redirectTo: '/home',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
