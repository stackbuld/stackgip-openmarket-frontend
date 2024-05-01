import { Component, OnInit } from '@angular/core';
import {
  IRequestResponse,
  Requests,
  TransactionsResponse,
} from 'src/app/models/wallet.model';
import { WalletService } from 'src/app/services/wallet/wallet.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateRange } from '../../components/date-range/date-range.dto';

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
  dateType: string = 'Sort by';
  startDate: string = '';
  endDate: string = '';

  isDateRangeOpened: boolean = true;

  transactionFilterValues: string[] = [
    'all',
    'month',
    'week',
    'today',
    'custom',
  ];

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUser().id;
    this.getTransactions();
    this.getWithdrawalRequests();
  }

  applyDateRange(dateRange: DateRange): void {
    this.startDate = dateRange.start;
    this.endDate = dateRange.end;
    this.getTransactions();
    this.isDateRangeOpened = false;
  }

  applyFilter(): void {
    if (this.dateType == 'custom') {
      this.isDateRangeOpened = true;
      return;
    }
    this.isDateRangeOpened = false;
    this.getTransactions();
  }

  formatDate(date: Date) {
    return `${new Date(date).toDateString()}`;
  }
  formatTime(date: Date) {
    return `${new Date(date).toLocaleTimeString()}`;
  }

  getTransactions() {
    this.loadingTransactions = true;
    this.walletService
      .getTransactions({
        userId: this.userId,
        pageSize: this.pageSize,
        page: this.page,
        dateType: this.dateType,
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
