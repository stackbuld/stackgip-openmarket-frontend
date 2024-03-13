import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from '../../../../services/toastr.service';
import { UserService } from '../../../../services/user/user.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { nigeriaSates } from 'src/app/data/nigeriastates';
import { IUpdateUser, IUser } from 'src/app/models/IUserModel';
import { MatDialog } from '@angular/material/dialog';
import { OTPDialogComponent } from '../otp-dialog/otp-dialog.component';
import { EmailDialogComponent } from '../email-dialog/email-dialog.component';
import { SellerService } from 'src/app/services/seller/seller.service';
import { CountryService } from 'src/app/services/country/country.service';
import { CountryInfo } from 'src/app/models/country.model';
import { countryCodes } from 'src/app/data/countryCodes';
import { environment } from 'src/environments/environment';
import { SellerProfileData } from 'src/app/models/sellerModel';
import { profile } from 'console';
declare var cloudinary: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  states: string[] = [];
  isFetching: boolean = false;
  isSubmited = false;
  isSubmitting: boolean = false;
  isFetchingOtp: boolean = false;
  showUserUpdateButtons: boolean = false;
  selectedState!: string;
  countryDialCode: string;
  @ViewChild('telInput', { static: false })
  telInput: ElementRef<HTMLInputElement>;
  telInputEvent: Event;
  countryInfo: CountryInfo[];
  codeList: any;
  personalPhoneNumber: string;
  isEmailVerified: boolean = false;
  isPhoneVerified: boolean = false;
  verifiedEmail: string;
  verifiedPhoneNumber: string;

  user = {} as IUser;
  specificUserData: SellerProfileData;
  userId: string;
  uploadCoverPhotoWidget: any;
  coverPhotoUrl: string = 'assets/image/cover-photo-placeholder.jpg';
  uploadProfilePhotoWidget: any;
  profilePhotoUrl: string = 'assets/image/default-profile-picture-3.png';
  isSendingEmailVerification: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toast: ToastrService,
    private authService: AuthService,
    private sellerService: SellerService,
    private dialog: MatDialog,
    private countryService: CountryService,
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.codeList = countryCodes;

    this.states = nigeriaSates.map((a) => a.name);
    this.states.unshift('Select a state');

    this.profileForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      countryCode: ['+234'],
      email: [null, [Validators.required, Validators.email]],
      bio: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
    });

    this.userId = this.authService.getLoggedInUser().id;

    this.sellerService.phoneNumberConfirmed.subscribe((status) => {
      this.isPhoneVerified = status;
    });

    this.sellerService.getSeller(this.userId).subscribe({
      next: (user) => {
        this.user = user.data;
        this.personalPhoneNumber = user.data.phoneNumber;
        const reformedPhoneNumber = this.user.phoneNumber.slice(-10);

        this.specificUserData = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          bio: this.user.bio,
          profileImageUrl: this.user.profileImageUrl,
          alpha2CountryCode: this.user.alpha2CountryCode,
          state: this.user.state,
          coverPhotoUrl: this.user.coverPhotoUrl,
        };

        this.isEmailVerified = user.data.emailConfirmed;

        this.isPhoneVerified = user.data.phoneNumberConfirmed;

        if (this.user.coverPhotoUrl) {
          this.coverPhotoUrl = this.user.coverPhotoUrl;
        }

        if (this.user.profileImageUrl) {
          this.profilePhotoUrl = this.user.profileImageUrl;
        }

        if (user.data.emailConfirmed) {
          this.verifiedEmail = this.user.email;
        }

        if (user.data.phoneNumberConfirmed) {
          this.verifiedPhoneNumber = reformedPhoneNumber;
        }

        this.profileForm.setValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          countryCode: '+234',
          email: this.user.email,
          bio: this.user.bio,
          phoneNumber: reformedPhoneNumber,
          country:
            this.user.alpha2CountryCode === 'NGN'
              ? 'NG'
              : this.user.alpha2CountryCode,
          state: this.user.state,
        });

        this.profileForm.get('email').disable();

        this.isFetching = false;

        const initialUserForm = this.profileForm.value;

        this.profileForm.valueChanges.subscribe((value) => {
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

    this.uploadCoverPhotoWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          this.toast.success('Image uploaded successfully');

          this.coverPhotoUrl = result.info.secure_url;

          this.sellerService
            .updateSellerPersonalProfile({
              ...this.specificUserData,
              coverPhotoUrl: result.info.secure_url,
            })
            .subscribe({
              next: (data) => {
                this.isSubmitting = false;
              },
              error: (err) => {},
            });
        }
      },
    );

    this.uploadProfilePhotoWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          this.toast.success('Image uploaded successfully');

          this.profilePhotoUrl = result.info.secure_url;

          this.sellerService.newProfilePicture.next(this.profilePhotoUrl);
          localStorage.setItem('profilePicUrl', this.profilePhotoUrl);
          this.sellerService
            .updateSellerPersonalProfile({
              ...this.specificUserData,
              profileImageUrl: result.info.secure_url,
            })
            .subscribe({
              next: (data) => {
                this.isSubmitting = false;
              },
              error: (err) => {},
            });
        }
      },
    );
  }

  get f() {
    return this.profileForm.controls;
  }

  onUploadCoverPhoto(): void {
    this.uploadCoverPhotoWidget.open();
  }

  onUploadProfilePhoto(): void {
    this.uploadProfilePhotoWidget.open();
  }

  changeOption(e: any) {
    this.profileForm.patchValue({ countryCodes: e.target.value });
  }

  onEmailVerify() {
    this.isSendingEmailVerification = true;

    this.authService.resendConfirmationEmail(this.user.email).subscribe({
      next: (data) => {
        this.isSendingEmailVerification = false;

        const dialogRef = this.dialog.open(EmailDialogComponent, {
          panelClass: 'otp_dialog',
          data: { email: this.user.email },
        });
        this.toast.success('Verification email sent successfully!');
      },
      error: (err) => {
        this.isSendingEmailVerification = false;
        this.toast.error(err.error.message);
      },
    });
  }

  onVerifyPhoneNumber() {
    this.isFetchingOtp = true;
    const formattedPhoneNumber =
      this.profileForm.get('countryCode').value.toString() +
      this.profileForm.get('phoneNumber').value.toString();

    this.authService.sendPersonalPhoneOTP().subscribe({
      next: (data) => {
        this.isFetchingOtp = false;

        this.toast.success('OTP sent successfully!');

        const dialogRef = this.dialog.open(OTPDialogComponent, {
          panelClass: 'otp_dialog',
          data: {
            type: 'phoneNumberOTP',
            payload: formattedPhoneNumber,
            phoneNumber: formattedPhoneNumber,
          },
        });
      },
      error: (err) => {
        this.isFetchingOtp = false;
        this.toast.error(err.error.message);
      },
    });
  }

  onUpdateProfile() {
    if (this.profileForm.invalid) {
      this.toast.error('All required fields must be filled!');
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const profileFormValue = this.profileForm.value;

    const formattedPhoneNumber =
      profileFormValue.countryCode.toString() +
      profileFormValue.phoneNumber.toString();

    let data: SellerProfileData = {
      firstName: profileFormValue.firstName,
      lastName: profileFormValue.lastName,
      bio: profileFormValue.bio,
      state: profileFormValue.state,
      alpha2CountryCode: profileFormValue.country,
      profileImageUrl: this.profilePhotoUrl,
      coverPhotoUrl: this.coverPhotoUrl,
    };

    if (
      JSON.stringify(formattedPhoneNumber) !==
      JSON.stringify(this.user.phoneNumber)
    ) {
      data = {
        ...data,
        phoneNumber: formattedPhoneNumber,
      };
    }

    this.sellerService.updateSellerPersonalProfile(data).subscribe({
      next: (data) => {
        this.isSubmitting = false;
        this.showUserUpdateButtons = false;
        this.isPhoneVerified = data['data'].phoneNumberConfirmed;

        this.toast.success('Profile updated successfully');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error('Something went wrong!');
      },
    });
  }

  onCancelUpdate() {
    this.showUserUpdateButtons = false;
  }
}
