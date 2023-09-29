import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  verificationFailureReason: string;
  approvalStatus: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sellerService: SellerService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.userId = this.authService.getLoggedInUser().id;

    this.sellerService.getSeller(this.userId).subscribe({
      next: (user) => {
        this.isFetching = false;

        console.log(user.data);
        this.verificationFailureReason = user.data.rejectionReason;
        this.approvalStatus = user.data.sellerApprovalStatus;
        this.kycVerified = user.data.isSellerApproved;
      },
      error: (err) => {
        this.toast.error(err.error.message);
      },
    });
  }

  onVerify() {
    this.router.navigate(['/', 'seller-form']);
  }
}
