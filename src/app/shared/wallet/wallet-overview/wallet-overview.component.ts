import { Component, OnInit } from '@angular/core';
import {
  IRequestResponse,
  Requests,
  TransactionsResponse,
} from 'src/app/models/wallet.model';
import { WalletService } from 'src/app/services/wallet/wallet.service';

@Component({
  selector: 'app-wallet-overview',
  templateUrl: './wallet-overview.component.html',
  styleUrls: ['./wallet-overview.component.scss', '../wallet.component.scss'],
})
export class WalletOverviewComponent {
  transactionsList: TransactionsResponse;
  withdrawalRequests: Requests;
  loadingTransactions: boolean;
  loadingRequests: boolean;
  tab = 1;

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.getTransactions();
    this.getWithdrawalRequests();
  }

  formatDate(date: Date) {
    return `${new Date(date).toDateString()}`;
  }
  formatTime(date: Date) {
    return `${new Date(date).toLocaleTimeString()}`;
  }

  getTransactions() {
    this.loadingTransactions = true;
    this.walletService.getTransactions().subscribe(
      (res) => {
        this.loadingTransactions = false;
        this.transactionsList = res.data;
      },
      (err) => {
        this.loadingTransactions = false;
        console.log(err);
      }
    );
  }

  getWithdrawalRequests() {
    this.loadingRequests = false;
    this.walletService.getRequests().subscribe(
      (res: IRequestResponse) => {
        console.log(res.data);
        this.loadingRequests = false;
        this.withdrawalRequests = res.data;
      },
      (err) => {
        this.loadingRequests = false;
        console.log(err);
      }
    );
  }
}
