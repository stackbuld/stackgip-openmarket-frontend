import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/services/auth.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import { IUser } from '../../../../models/IUserModel';
import { environment } from '../../../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { ScriptLoaderService } from '../../../../services/script-loader.service';
//
// declare function verifyKyc(
//   appId: string,
//   widgetId: string,
//   key: string,
//   user: IUser,
// ): void;

declare var Connect;
@Component({
  selector: 'app-seller-kyc',
  templateUrl: './seller-kyc.component.html',
  styleUrls: ['./seller-kyc.component.scss'],
})
export class SellerKycComponent implements OnInit {
  isFetching = false;
  kycVerified = false;
  userId: string;
  verificationFailureReason: string;
  user!: IUser;
  approvalStatus: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sellerService: SellerService,
    private toast: ToastrService,
    private scriptLoader: ScriptLoaderService,
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.userId = this.authService.getLoggedInUser().id;

    this.sellerService.getSeller(this.userId).subscribe({
      next: (user) => {
        this.isFetching = false;
        this.user = user.data;
        console.log(this.user);
        this.verificationFailureReason = user.data.rejectionReason;
        this.approvalStatus = user.data.sellerApprovalStatus;
        this.kycVerified = user.data.isKycVerified;
      },
      error: (err) => {
        this.isFetching = false;
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
      this.user.verificationReferenceNumber = uuidv4();
    }

    this.verifyKyc(
      environment.kycVerificationWidgetId.appId,
      widgetId,
      environment.kycVerificationWidgetId.key,
      this.user,
    );
  }

  verifyKyc(appId, widgetId, key, user) {
    const dateString = user.dateOfBirth;
    const dateObject = new Date(dateString);

    const newDate = dateObject.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const options = {
      app_id: appId, // your app_id here
      p_key: key, // your production public key here
      type: 'custom',
      user_data: {
        first_name: user.firstName, // optional
        last_name: user.lastName, // optional
        dob: newDate ?? '', // YYYY-MM-DD Optional
        residence_country: 'NG', // user.alpha2CountryCode, // optional
        email: user.email, // optional
      },
      reference_id: user.verificationReferenceNumber,
      metadata: {
        user_id: user.id,
      },
      gov_data: {
        nin: user.idVerificationNumber,
      },

      config: {
        widget_id: widgetId, // this is generated from easyonboard
      },
      onSuccess: (response) => {
        alert(response.message);
        this.router.navigate(['/seller/profile/kyc-verification']);
        console.log('Success', response);
      },
      onError: (err) => {
        console.log('Error', err);
      },
      onClose: () => {
        console.log('Widget closed');
      },
    };

    const connect = new Connect(options);
    connect.setup();
    connect.open();
  }
}
