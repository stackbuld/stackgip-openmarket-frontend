import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-kyc',
  templateUrl: './seller-kyc.component.html',
  styleUrls: ['./seller-kyc.component.scss'],
})
export class SellerKycComponent {
  kycVerified: boolean = false;

  constructor(private router: Router) {}

  onVerify() {
    this.router.navigate(['/', 'seller-form']);
  }
}
