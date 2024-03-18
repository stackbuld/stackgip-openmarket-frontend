import { Component, OnInit } from '@angular/core';
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
import { Router, RouterLink } from '@angular/router';
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
export class TransactionsComponent implements OnInit {
  userId: string;
  pageSize: number = 4;
  page: number = 1;
  transactions: TransactionItem[] = [];
  totalTransactions!: number;
  isLoadingTransactions: boolean = false;
  isLoadingBalance: boolean = false;
  mainFunds!: IWallet;

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.userId = this.authService.getLoggedInUser().id;
    this.getWalletDetails();
    this.getTransactions(1);
  }

  getTransactions(pageNumber: number) {
    this.isLoadingTransactions = true;
    this.walletService
      .getTransactions({
        userId: this.userId,
        pageSize: this.pageSize,
        page: pageNumber,
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
        this.mainFunds = [...res.data].find(
          (value: IWallet) => value.walletType === 'MAIN',
        );
      },
      error: (err) => {
        this.isLoadingBalance = false;
      },
    });
  }

  onNavigateBack() {
    this.location.back();
  }
}
