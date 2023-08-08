import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet/wallet.service';

@Component({
  selector: 'app-wallet-overview',
  templateUrl: './wallet-overview.component.html',
  styleUrls: ['./wallet-overview.component.scss', '../wallet.component.scss']
})
export class WalletOverviewComponent {

  transactionsList: any;
  loadingTransactions: boolean;

  constructor(private walletService: WalletService){}

  ngOnInit(): void { 
    this.getTransactions()
  }



  getTransactions() {
        this.loadingTransactions = true
    this.walletService.getTransactions().subscribe(
      (res) => {
        console.log(res)
        this.loadingTransactions= false
        this.transactionsList = res.data
      },
      (err) => {
        console.log(err)
        
      }
    );
    }
}
