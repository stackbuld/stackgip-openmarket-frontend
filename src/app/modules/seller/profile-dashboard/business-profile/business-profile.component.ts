import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { nigeriaSates } from 'src/app/data/nigeriastates';
import { countryCodes } from 'src/app/data/countryCodes';
import { IUser } from 'src/app/models/IUserModel';
import { CountryInfo } from 'src/app/models/country.model';
import { SellerBusinessProfileData } from 'src/app/models/sellerModel';
import { AuthService } from 'src/app/services/auth.service';
import { CountryService } from 'src/app/services/country/country.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import { ToastrService } from 'src/app/services/toastr.service';
import { OTPDialogComponent } from '../otp-dialog/otp-dialog.component';
import { log } from 'console';

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
  codeList: any;
  countryInfo: CountryInfo[];
  isInvalidPhoneNumber: boolean = false;
  isSellerApproved: boolean = false;

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
    this.codeList = countryCodes;

    this.states = nigeriaSates.map((a) => a.name);
    this.states.unshift('Select a state');

    this.userId = this.authService.getLoggedInUser().id;

    this.businessProfileForm = this.fb.group({
      businessName: [null, [Validators.required]],
      countryCode: ['+234'],
      businessEmail: [null, [Validators.required, Validators.email]],
      businessPhoneNumber: [null, [Validators.required]],
      businessAddress: [null, [Validators.required]],
      businessState: [null, [Validators.required]],
      businessCountry: [null, [Validators.required]],
      businessWebsite: [null],
      businessSocialFacebook: [null],
      businessSocialX: [null],
      businessSocialInstagram: [null],
    });

    this.sellerService.businessPhoneConfirmed.subscribe((status) => {
      this.isBusinessPhoneNumberVerified = status;
    });

    this.sellerService.getSeller(this.userId).subscribe({
      next: (user) => {
        this.isFetching = false;
        console.log(user);
        this.user = user.data;
        this.isBusinessPhoneNumberVerified = this.user.businessPhoneConfirmed;
        let reformedPhoneNumber = null;
        if (this.user.businessPhone) {
          reformedPhoneNumber = this.user.businessPhone.slice(-10);
        }

        if (user.data.businessPhoneConfirmed) {
          this.verifiedBusinessPhoneNumber = reformedPhoneNumber;
        }

        this.businessProfileForm.setValue({
          businessName: this.user.businessName,
          businessEmail: this.user.businessEmail,
          countryCode: '+234',
          businessPhoneNumber: reformedPhoneNumber,
          businessAddress: this.user.businessAddress,
          businessState: this.user.businessState,
          businessCountry: 'NG',
          businessWebsite: this.user.businessWebsite,
          businessSocialFacebook: this.user.businessSocialLinks?.facebook || '',
          businessSocialX: this.user.businessSocialLinks?.twitter || '',
          businessSocialInstagram:
            this.user.businessSocialLinks?.instagram || '',
        });

        this.isSellerApproved = this.user.isSellerApproved;
        if (this.user.isSellerApproved) {
          this.businessProfileForm.get('businessName').disable();
          this.businessProfileForm.get('businessAddress').disable();
          this.businessProfileForm.get('businessState').disable();
          this.businessProfileForm.get('businessCountry').disable();
        }

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
        this.toast.error('Something went wrong!');
      },
    });

    this.countryService.getCountry().subscribe({
      next: (data) => {
        this.countryInfo = data;
      },
    });

    this.businessProfileForm.valueChanges.subscribe((value) => {
      if (value.businessPhoneNumber !== this.verifiedBusinessPhoneNumber) {
        this.isBusinessPhoneNumberVerified = false;
      } else {
        this.isBusinessPhoneNumberVerified = true;
      }
    });
  }

  get f() {
    return this.businessProfileForm.controls;
  }

  get phoneNumberField() {
    return <FormControl>this.businessProfileForm.get('businessPhoneNumber');
  }

  checkInput() {
    if (this.phoneNumberField.invalid) {
      this.isInvalidPhoneNumber = true;
    } else {
      this.isInvalidPhoneNumber = false;
    }
  }

  changeOption(e: any) {
    this.businessProfileForm.patchValue({ countryCodes: e.target.value });
  }

  trackByFn(index, item) {
    return index;
  }

  onVerifyBusinessPhoneNumber() {
    this.isFetchingOtp = true;

    const formattedPhoneNumber =
      this.businessProfileForm.get('countryCode').value.toString() +
      this.phoneNumberField.value.toString();
    console.log(formattedPhoneNumber);

    this.authService.sendBusinessPhoneOTP().subscribe({
      next: (data) => {
        this.isFetchingOtp = false;

        const dialogRef = this.dialog.open(OTPDialogComponent, {
          panelClass: 'otp_dialog',
          data: {
            type: 'businessPhoneNumberOTP',
            payload: formattedPhoneNumber,
          },
        });
        this.toast.success('OTP sent successfully!');
      },
      error: (err) => {
        this.isFetchingOtp = false;
        this.toast.error(err.error.message);
      },
    });
  }

  onUpdateBusinessProfile() {
    console.log(this.businessProfileForm);

    if (this.businessProfileForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const formattedPhoneNumber =
      this.businessProfileForm.get('countryCode').value.toString() +
      this.businessProfileForm.get('businessPhoneNumber').value.toString();

    const formValue = this.businessProfileForm.value;
    const socialLinks = {
      facebook: formValue.businessSocialFacebook,
      twitter: formValue.businessSocialX,
      instagram: formValue.businessSocialInstagram,
    };

    const rawForm = this.businessProfileForm.getRawValue();

    const mainForm: SellerBusinessProfileData = {
      businessName: rawForm.businessName,
      businessEmail: formValue.businessEmail,
      businessPhone: formattedPhoneNumber,
      businessAddress: rawForm.businessAddress,
      businessState: rawForm.businessState,
      businessCountryCode: rawForm.businessCountry,
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
        this.isSubmitting = false;

        this.toast.error(err.error.message);
      },
    });
  }

  onCancelUpdate() {
    this.showUserUpdateButtons = false;
  }
}
