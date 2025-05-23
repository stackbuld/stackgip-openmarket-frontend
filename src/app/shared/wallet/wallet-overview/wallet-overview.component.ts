import { IUser } from './../../../models/IUserModel';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { SellerService } from 'src/app/services/seller/seller.service';

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
  user: IUser;
  pageSize: number = 10;
  page: number = 1;
  dateType: string = '';
  startDate: string = '';
  endDate: string = '';
  hasDoneKyc: boolean = false;
  hasDoneNinVerification: boolean = false;
  openAlert = false;

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
    private router: Router,
    private alert: AlertService,
    private sellerService: SellerService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.getTransactions({ isInitial: true });
    this.getWithdrawalRequests();
    this.getSeller();
  }

  getSeller(): void {
    this.sellerService.getSeller(this.user.id).subscribe({
      next: (user) => {
        this.user = user.data;
        if (!this.user.isKycVerified || !this.user.isNINAdded) {
          this.alert.open();
        }
      },
    });
  }

  applyDateRange(dateRange: DateRange): void {
    this.dateType = 'custom';
    this.startDate = dateRange.start;
    this.endDate = dateRange.end;
    this.getTransactions();
  }

  applyFilter(): void {
    if (this.dateType == '') return;
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
        userId: this.user.id,
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

  withdraw(): void {
    if (this.user.sellerApprovalStatus == 'approved') {
      if (this.user.isKycVerified && this.user.isNINAdded) {
        this.router.navigateByUrl('/seller/wallet/withdraw');
        return;
      }
      this.alert.open();
      return;
    }
    if (this.user.sellerApprovalStatus == 'failedKyc'){
      this.alert.open();
      return;
    }
      this.router.navigateByUrl('/homepage/wallet/withdraw');
  }

  get getTooltipMessage(): string {
    if (this.user.sellerApprovalStatus == 'approved') {
      if (!this.user.isNINAdded) {
        return 'Complete your nin verification first';
      }
      if (!this.user.isKycVerified) {
        return 'Complete your kyc verification first.';
      }
    }
    if (
      this.user.sellerApprovalStatus == 'pending' ||
      this.user.sellerApprovalStatus == 'pendingKycReview'
    ) {
      return 'We are currently reviewing your account.';
    }
  }

  getWithdrawalRequests() {
    this.loadingRequests = false;
    this.walletService.getRequests(this.user.id).subscribe({
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
