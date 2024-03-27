import { Component, OnDestroy, OnInit } from '@angular/core';
import { WalletService } from '../../../services/wallet/wallet.service';
import { IWallet, TransactionItem } from '../../../models/wallet.model';
import { AuthService } from '../../../services/auth.service';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TransactionAmount,
  TransactionDirective,
} from '../../directives/transaction.directive';
import { LockedFundsComponent } from '../locked-funds/locked-funds.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxPaginationModule } from '../../pagination/ngx-pagination.module';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TransactionDirective,
    TransactionAmount,
    LockedFundsComponent,
    RouterLink,
    NgxPaginationModule,
    SharedModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit, OnDestroy {
  userId: string;
  pageSize: number = 10;
  page: number = 1;
  transactions: TransactionItem[] = [];
  totalTransactions!: number;
  isLoadingTransactions: boolean = false;
  isLoadingBalance: boolean = false;
  walletId!: string;
  wallet: IWallet;

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
    private location: Location,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.userId = this.authService.getLoggedInUser().id;
    this.route.queryParams.subscribe((param) => {
      this.walletId = param['id'];
      this.getWalletDetails();
      this.getTransactions(1);
    });
  }

  getTransactions(pageNumber: number) {
    this.isLoadingTransactions = true;
    this.walletService
      .getTransactions({
        userId: this.userId,
        pageSize: this.pageSize,
        page: pageNumber,
        walletId: this.walletId,
      })
      .subscribe({
        next: (res) => {
          this.isLoadingTransactions = false;
          this.transactions = res.data.items;
          this.totalTransactions = res.data.totalCount;
          this.page = res.data.pageNumber;
        },
        error: (err) => {
          this.isLoadingTransactions = false;
        },
      });
  }

  getWalletDetails() {
    this.isLoadingBalance = true;
    this.walletService.getWallet().subscribe({
      next: (res) => {
        this.isLoadingBalance = false;
        this.wallet = res.data.find((wallet) => wallet.id == this.walletId);
      },
      error: (err) => {
        this.isLoadingBalance = false;
      },
    });
  }

  onNavigateBack() {
    this.location.back();
  }

  ngOnDestroy() {
    localStorage.removeItem('isShowingLocked');
  }
}
