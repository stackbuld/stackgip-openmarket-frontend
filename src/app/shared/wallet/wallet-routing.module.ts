import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletOverviewComponent } from './wallet-overview/wallet-overview.component';
import { WalletWithdrawComponent } from './wallet-withdraw/wallet-withdraw.component';
import {WalletComponent} from './wallet.component'

const routes: Routes = [
  {
    path: '', component: WalletComponent,
    children: [
      { path: '', component: WalletOverviewComponent, },
      { path: 'withdraw', component: WalletWithdrawComponent, },
      
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
  
  
  
  
export class WalletRoutingModule {

 }
