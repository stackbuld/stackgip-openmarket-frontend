import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IUser } from '../../models/IUserModel';
import { IWallet } from '../../models/wallet.model';
import { WalletService } from '../../services/wallet/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent {
  wallet: IWallet[];
  loading: boolean;
  currentRoute: string[] = [];
  user: IUser;
  escrowFunds?: IWallet;
  cashbackFunds?: IWallet;
  mainFunds?: IWallet;

  constructor(private router: Router, private walletService: WalletService) {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd
        ? (this.currentRoute = event.url.split('/'))
        : null;
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getWalletDetails();
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
        console.log(err);
        this.loading = false;
      },
    });
  }

  getBankAccount() {
    this.loading = true;
    this.walletService.getBankAccounts().subscribe(
      (res) => {
        console.log(res);
        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }
}
