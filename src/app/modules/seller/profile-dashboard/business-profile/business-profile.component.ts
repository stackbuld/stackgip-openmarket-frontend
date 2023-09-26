import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { log } from 'console';

import { nigeriaSates } from 'src/app/data/nigeriastates';
import { IUser } from 'src/app/models/IUserModel';
import { CountryInfo } from 'src/app/models/country.model';
import { SellerBusinessProfileData } from 'src/app/models/sellerModel';
import { AuthService } from 'src/app/services/auth.service';
import { CountryService } from 'src/app/services/country/country.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import { ToastrService } from 'src/app/services/toastr.service';
import { OTPDialogComponent } from '../otp-dialog/otp-dialog.component';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss'],
})
export class BusinessProfileComponent implements OnInit {
  states: string[] = [];
  isFetching: boolean = false;
  selectedBusinessState!: string;
  businessProfileForm!: FormGroup;
  user = {} as IUser;
  userId!: string;
  showUserUpdateButtons: boolean = false;
  isSubmitting: boolean = false;
  isFetchingOtp: boolean = false;
  isBusinessPhoneNumberVerified: boolean = false;
  verifiedBusinessPhoneNumber: string;
  countryInfo: CountryInfo[];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sellerService: SellerService,
    private toast: ToastrService,
    private dialog: MatDialog,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.isFetching = true;

    this.states = nigeriaSates.map((a) => a.name);
    this.states.unshift('Select a state');

    this.userId = this.authService.getLoggedInUser().id;

    this.businessProfileForm = this.fb.group({
      businessName: [null, [Validators.required]],
      businessEmail: [null, [Validators.required, Validators.email]],
      businessPhoneNumber: [null, [Validators.required]],
      businessAddress: [null, [Validators.required]],
      businessState: [null, [Validators.required]],
      businessCountry: [null, [Validators.required]],
      businessWebsite: [null, [Validators.required]],
      businessSocialFacebook: [null, [Validators.required]],
      businessSocialX: [null, [Validators.required]],
      businessSocialInstagram: [null, [Validators.required]],
    });

    this.sellerService.getSeller(this.userId).subscribe({
      next: (user) => {
        this.isFetching = false;
        console.log(user);
        this.user = user.data;
        this.isBusinessPhoneNumberVerified = this.user.businessPhoneConfirmed;

        if (user.data.businessPhoneConfirmed) {
          localStorage.setItem('verifiedPhone', this.user.phoneNumber);
          this.verifiedBusinessPhoneNumber = this.user.businessPhone;
        }

        this.businessProfileForm.setValue({
          businessName: this.user.businessName,
          businessEmail: this.user.businessEmail,
          businessPhoneNumber: this.user.businessPhone,
          businessAddress: this.user.businessAddress,
          businessState: this.user.businessState,
          businessCountry: this.user.businessCountryCode,
          businessWebsite: this.user.businessWebsite,
          businessSocialFacebook: this.user.businessSocialLinks?.facebook || '',
          businessSocialX: this.user.businessSocialLinks?.twitter || '',
          businessSocialInstagram:
            this.user.businessSocialLinks?.instagram || '',
        });

        const initialUserForm = this.businessProfileForm.value;

        this.businessProfileForm.valueChanges.subscribe((value) => {
          if (JSON.stringify(value) != JSON.stringify(initialUserForm)) {
            this.showUserUpdateButtons = true;
          } else {
            this.showUserUpdateButtons = false;
          }
        });
      },
      error: (err) => {
        this.isFetching = false;
        console.log(err);
      },
    });

    this.countryService.getCountry().subscribe({
      next: (data) => {
        console.log(data);
        this.countryInfo = data;
      },
    });

    this.businessProfileForm.valueChanges.subscribe((value) => {
      if (value.businessPhoneNumber !== this.verifiedBusinessPhoneNumber) {
        this.isBusinessPhoneNumberVerified = false;
      }
    });
  }

  trackByFn(index, item) {
    return index;
  }

  onVerfiyBusinessPhoneNumber() {
    this.isFetchingOtp = true;

    this.authService.sendBusinessPhoneOTP().subscribe({
      next: (data) => {
        this.isFetchingOtp = false;

        const dialogRef = this.dialog.open(OTPDialogComponent, {
          panelClass: 'otp_dialog',
          data: {
            type: 'businessPhoneNumberOTP',
            payload: this.businessProfileForm.value.businessPhoneNumber,
          },
        });
      },
      error: (err) => {
        this.isFetchingOtp = false;
        console.log(err);
      },
    });
  }

  onUpdateBusinessProfile() {
    console.log(this.businessProfileForm);

    if (this.businessProfileForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const formValue = this.businessProfileForm.value;
    const socialLinks = {
      facebook: formValue.businessSocialFacebook,
      twitter: formValue.businessSocialX,
      instagram: formValue.businessSocialInstagram,
    };

    const mainForm: SellerBusinessProfileData = {
      businessName: formValue.businessName,
      businessEmail: formValue.businessEmail,
      businessPhone: '+2349131778206',
      businessAddress: formValue.businessAddress,
      businessState: formValue.businessState,
      businessCountryCode: formValue.businessCountry,
      businessWebsite: formValue.businessWebsite,
      businessSocialLinks: socialLinks,
    };

    this.sellerService.updateSellerBusinessProfile(mainForm).subscribe({
      next: (data) => {
        this.isSubmitting = false;
        this.showUserUpdateButtons = false;

        this.toast.success('Profile updated successfully');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onCancelUpdate() {
    this.showUserUpdateButtons = false;
  }
}
