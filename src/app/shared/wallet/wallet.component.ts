import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IUser } from '../../models/IUserModel';
import { IWallet } from '../../models/wallet.model';
import { WalletService } from '../../services/wallet/wallet.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SellerService } from 'src/app/services/seller/seller.service';
import { AlertService } from '../services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit, OnDestroy {
  wallet: IWallet[];
  loading: boolean;
  currentRoute: string[] = [];
  user: IUser;
  escrowFunds?: IWallet;
  cashbackFunds?: IWallet;
  mainFunds?: IWallet;
  destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private walletService: WalletService,
    private alert: AlertService,
    private sellerService: SellerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url.split('/');

    this.user = this.authService.getLoggedInUser();
    this.getWalletDetails();
    this.getSeller();
    this.walletService.walletRefresh
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getWalletDetails();
      });
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

  getWalletDetails() {
    this.loading = true;
    this.walletService.getWallet().subscribe({
      next: (res) => {
        this.wallet = res.data;
        this.mainFunds = [...res.data].find(
          (value: IWallet) => value.walletType === 'MAIN'
        );
        this.escrowFunds = [...res.data].find(
          (value: IWallet) => value.walletType === 'ESCROW'
        );
        this.cashbackFunds = [...res.data].find(
          (value: IWallet) => value.walletType === 'CASHBACK'
        );
        this.loading = false;
        this.walletService.setWalletInfo(res.data[0]);
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  getBankAccount() {
    this.loading = true;
    this.walletService.getBankAccounts(this.user.id).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onNavigateToTransactions(id: string) {
    const route = this.router.url;

    if (route.includes('seller')) {
      this.router.navigate(['/seller/transaction-history'], {
        relativeTo: this.route,
        queryParams: { id },
      });
    } else {
      this.router.navigate(['/buyer/transaction-history'], {
        relativeTo: this.route,
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
