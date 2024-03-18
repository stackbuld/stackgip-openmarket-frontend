import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IUser } from '../../models/IUserModel';
import { IWallet } from '../../models/wallet.model';
import { WalletService } from '../../services/wallet/wallet.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  ) {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd
        ? (this.currentRoute = event.url.split('/'))
        : null;
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getWalletDetails();
    this.walletService.walletRefresh
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getWalletDetails();
      });
  }

  getWalletDetails() {
    this.loading = true;
    this.walletService.getWallet().subscribe({
      next: (res) => {
        this.wallet = res.data;
        this.mainFunds = [...res.data].find(
          (value: IWallet) => value.walletType === 'MAIN',
        );
        this.escrowFunds = [...res.data].find(
          (value: IWallet) => value.walletType === 'ESCROW',
        );
        this.cashbackFunds = [...res.data].find(
          (value: IWallet) => value.walletType === 'CASHBACK',
        );
        this.loading = false;
        this.walletService.setWalletInfo(res.data[0]);
      },
      error: (err) => {
        console.log(err);
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

  onNavigateToTransactions() {
    const route = this.router.url;
    if (route.includes('seller')) {
      this.router.navigate(['/seller/transaction-history'], {
        relativeTo: this.route,
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
