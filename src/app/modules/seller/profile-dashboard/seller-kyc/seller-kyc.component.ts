import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SellerService } from 'src/app/services/seller/seller.service';

@Component({
  selector: 'app-seller-kyc',
  templateUrl: './seller-kyc.component.html',
  styleUrls: ['./seller-kyc.component.scss'],
})
export class SellerKycComponent implements OnInit {
  isFetching: boolean = false;
  kycVerified: boolean = false;
  userId: string;
  approvalStatus: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sellerService: SellerService
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.userId = this.authService.getLoggedInUser().id;

    this.sellerService.getSeller(this.userId).subscribe({
      next: (user) => {
        this.isFetching = false;

        console.log(user.data);
        this.approvalStatus = user.data.sellerApprovalStatus;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onVerify() {
    this.router.navigate(['/', 'seller-form']);
  }
}
