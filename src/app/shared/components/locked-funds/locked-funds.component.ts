import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockedFunds } from '../../../models/wallet.model';
import { WalletService } from '../../../services/wallet/wallet.service';
import { AuthService } from '../../../services/auth.service';
import { NgxPaginationModule } from '../../pagination/ngx-pagination.module';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-locked-funds',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, SharedModule],
  templateUrl: './locked-funds.component.html',
  styleUrls: ['./locked-funds.component.scss'],
})
export class LockedFundsComponent implements OnInit {
  userId: string;
  lockedFundsPageSize: number = 4;
  lockedFundsPage: number = 1;
  lockedFunds: LockedFunds[] = [];
  totalLockedFunds!: number;
  isLoadingLockedFunds: boolean = false;

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.userId = this.authService.getLoggedInUser().id;
    this.getLockedFunds(1);
  }

  getLockedFunds(pageNumber: number) {
    console.log(1);
    this.isLoadingLockedFunds = true;
    this.walletService
      .getLockedFunds({
        userId: this.userId,
        pageSize: this.lockedFundsPageSize,
        page: pageNumber,
      })
      .subscribe({
        next: (res) => {
          this.isLoadingLockedFunds = false;
          this.lockedFunds = res.data.items;
          this.totalLockedFunds = res.data.totalCount;
          this.lockedFundsPage = res.data.pageNumber;
        },
        error: (err) => {
          this.isLoadingLockedFunds = false;
        },
      });
  }
}
