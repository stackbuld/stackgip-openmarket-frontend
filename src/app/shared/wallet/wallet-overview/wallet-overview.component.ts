import { Component, OnInit } from '@angular/core';
import {
  IRequestResponse,
  Requests,
  TransactionsResponse,
} from 'src/app/models/wallet.model';
import { WalletService } from 'src/app/services/wallet/wallet.service';
import { AuthService } from '../../../services/auth.service';

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
  userId!: string;

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUser().id;
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
      },
    );
  }

  getWithdrawalRequests() {
    this.loadingRequests = false;
    this.walletService.getRequests(this.userId).subscribe({
      next: (res: IRequestResponse) => {
        this.loadingRequests = false;
        this.withdrawalRequests = res.data;
      },
      error: (err) => {
        this.loadingRequests = false;
      },
    });
  }
}
