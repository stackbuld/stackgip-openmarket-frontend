import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../services/wallet/wallet.service';
import { TransactionItem } from '../../../models/wallet.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  userId: string;
  pageSize: number = 10;
  page: number = 1;
  transactions: TransactionItem[] = [];
  isLoadingTransactions: boolean = false;

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.userId = this.authService.getLoggedInUser().id;
    this.getTransactions();
  }

  getTransactions() {
    this.isLoadingTransactions = true;
    this.walletService
      .getTransactions({
        userId: this.userId,
        pageSize: this.pageSize,
        page: this.page,
      })
      .subscribe({
        next: (res) => {
          this.isLoadingTransactions = false;
          this.transactions = res.data.items;
        },
        error: (err) => {
          this.isLoadingTransactions = false;
        },
      });
  }
}
