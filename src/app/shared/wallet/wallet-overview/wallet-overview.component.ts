import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  IRequestResponse,
  Requests,
  TransactionsResponse,
} from 'src/app/models/wallet.model';
import { WalletService } from 'src/app/services/wallet/wallet.service';
import { AuthService } from '../../../services/auth.service';
import { DateRange } from '../../components/date-range/date-range.dto';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-wallet-overview',
  templateUrl: './wallet-overview.component.html',
  styleUrls: ['./wallet-overview.component.scss', '../wallet.component.scss'],
})
export class WalletOverviewComponent implements OnInit {
  transactionsList: TransactionsResponse;
  withdrawalRequests: Requests;
  loadingTransactions: boolean;
  loadingRequests: boolean;
  tab = 1;
  userId!: string;
  pageSize: number = 10;
  page: number = 1;
  dateType: string = '';
  startDate: string = '';
  endDate: string = '';

  isDateRangeOpened: boolean = true;

  constructor(
    private walletService: WalletService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUser().id;
    this.getTransactions({ isInitial: true });
    this.getWithdrawalRequests();
  }

  applyDateRange(dateRange: DateRange): void {
    this.startDate = dateRange.start;
    this.endDate = dateRange.end;
    this.getTransactions();
  }

  applyFilter(): void {
    if (this.dateType == 'custom') {
      return;
    }
    if (this.dateType == 'Sort by') return;
    this.isDateRangeOpened = false;
    this.getTransactions();
  }

  formatDate(date: Date) {
    return `${new Date(date).toDateString()}`;
  }
  formatTime(date: Date) {
    return `${new Date(date).toLocaleTimeString()}`;
  }

  getTransactions(model: { isInitial: boolean } = { isInitial: false }) {
    this.loadingTransactions = true;
    this.walletService
      .getTransactions({
        userId: this.userId,
        pageSize: this.pageSize,
        page: this.page,
        dateType: model.isInitial ? '' : this.dateType,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe({
        next: (res) => {
          this.loadingTransactions = false;
          this.transactionsList = res.data;
        },
        error: (err) => {
          this.loadingTransactions = false;
        },
      });
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
