import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/services/auth.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import { IUser } from '../../../../models/IUserModel';
import { environment } from '../../../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

declare function verifyKyc(
  appId: string,
  widgetId: string,
  key: string,
  user: IUser,
): void;

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
  user!: IUser;
  approvalStatus: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sellerService: SellerService,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.userId = this.authService.getLoggedInUser().id;

    this.sellerService.getSeller(this.userId).subscribe({
      next: (user) => {
        this.user = user.data;
        this.isFetching = false;
        this.verificationFailureReason = user.data.rejectionReason;
        this.approvalStatus = user.data.sellerApprovalStatus;
        this.kycVerified = user.data.isKycVerified;
      },
      error: (err) => {
        this.toast.error(err.error.message);
      },
    });
  }

  onVerify() {
    let widgetId: string;

    if (this.user.isBusinessRegistered) {
      widgetId = environment.kycVerificationWidgetId.business;
    } else if (!this.user.isBusinessRegistered) {
      widgetId = environment.kycVerificationWidgetId.individual;
    }

    if (
      !this.user.verificationReferenceNumber ||
      this.user.verificationReferenceNumber === ''
    ) {
      this.user['verificationReferenceNumber'] = uuidv4;
    }

    verifyKyc(
      environment.kycVerificationWidgetId.app_id,
      widgetId,
      environment.kycVerificationWidgetId.key,
      this.user,
    );
  }
}
