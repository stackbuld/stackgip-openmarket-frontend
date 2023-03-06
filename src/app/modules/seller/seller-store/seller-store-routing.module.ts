import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SellerStoreComponent } from './seller-store/seller-store.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SellerStoreComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerStoreRoutingModule {}
