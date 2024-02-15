import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet-kyc-prompt',
  templateUrl: './wallet-kyc-prompt.component.html',
  styleUrls: ['./wallet-kyc-prompt.component.scss'],
})
export class WalletKycPromptComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) {}

  onCloseDialog() {
    this.dialog.closeAll();
  }

  onNavigate() {
    this.router.navigate(['/seller/profile/kyc-verification']);
    this.onCloseDialog();
  }
}
