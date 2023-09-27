import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from '../../../../services/toastr.service';
import { UserService } from '../../../../services/user/user.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { nigeriaSates } from 'src/app/data/nigeriastates';
import { IUpdateUser, IUser } from 'src/app/models/IUserModel';
import { log } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { OTPDialogComponent } from '../otp-dialog/otp-dialog.component';
import { EmailDialogComponent } from '../email-dialog/email-dialog.component';
import { SellerKycComponent } from '../seller-kyc/seller-kyc.component';
import { SellerService } from 'src/app/services/seller/seller.service';
import { startWith } from 'rxjs';
import { CountryService } from 'src/app/services/country/country.service';
import { loadPlugin } from 'immer/dist/internal';
import { CountryInfo } from 'src/app/models/country.model';
import { countryCodes } from 'src/app/data/countryCodes';
import { environment } from 'src/environments/environment';
import { SellerProfileData } from 'src/app/models/sellerModel';
declare var cloudinary: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
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
  isEmailVerified: boolean = false;
  isPhoneVerified: boolean = false;
  verifiedEmail: string;
  verifiedPhoneNumber: string;

  user = {} as IUser;
  specificUserData: SellerProfileData;
  userId: string;
  uploadCoverPhotoWidget: any;
  coverPhotoUrl: string;
  uploadProfilePhotoWidget: any;
  profilePhotoUrl: string = 'assets/images/Rectangle65.png';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toast: ToastrService,
    private authService: AuthService,
    private sellerService: SellerService,
    private dialog: MatDialog,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.codeList = countryCodes;

    this.isFetching = true;

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

    this.sellerService.getSeller(this.userId).subscribe({
      next: (user) => {
        console.log(user);
        this.user = user.data;
        const reformedPhoneNumber = this.user.phoneNumber.slice(-10);

        this.specificUserData = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          bio: this.user.bio,
          profileImageUrl: this.user.profileImageUrl,
          alpha2CountryCode: this.user.alpha2CountryCode,
          state: this.user.state,
          phoneNumber: this.user.phoneNumber,
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
          country: this.user.alpha2CountryCode,
          state: this.user.state,
        });
        this.isFetching = false;
        console.log(this.profileForm.value);

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

        console.log(err);
      },
    });

    this.countryService.getCountry().subscribe({
      next: (data) => {
        console.log(data);
        this.countryInfo = data;
      },
    });

    this.profileForm.valueChanges.subscribe((value) => {
      if (value.phoneNumber !== this.verifiedPhoneNumber) {
        this.isPhoneVerified = false;
      } else {
        this.isPhoneVerified = true;
      }
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
          // this.imageName = result.info.original_filename;
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
              error: (err) => {
                console.log(err);
              },
            });
        }
      }
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
          // this.imageName = result.info.original_filename;
          this.profilePhotoUrl = result.info.secure_url;

          this.sellerService
            .updateSellerPersonalProfile({
              ...this.specificUserData,
              profileImageUrl: result.info.secure_url,
            })
            .subscribe({
              next: (data) => {
                this.isSubmitting = false;
              },
              error: (err) => {
                console.log(err);
              },
            });
        }
      }
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

  ngAfterViewInit(): void {
    if (!this.isFetching) {
      const phone = '+917878747416';
      this.profileForm.get('phoneNumber').setValue(phone);
      this.telInput.nativeElement.dispatchEvent(
        new KeyboardEvent('keyup', { bubbles: true })
      );
    }
  }

  changeOption(e: any) {
    console.log(e.target.value);
    this.profileForm.patchValue({ countryCodes: e.target.value });
  }

  trackByFn(index, item) {
    return index;
  }

  updateProfile() {
    const ctrl = this.f;
    const userProfile: IUpdateUser = {
      id: this.user.id,
      firstName: ctrl.firstname.value,
      lastName: ctrl.lastname.value,
      address: ctrl.address.value,
      alpha2CountryCode: ctrl.country.value,
      phoneNumber: ctrl.phoneNumber.value,
      state: ctrl.state.value,
      city: ctrl.state.value,
      scope: this.user.scope.split(','),
    };
    this.isSubmited = true;
    this.userService.updateUser(userProfile).subscribe(
      (a) => {
        this.toast.success('profile updated');
        const userUpdate = {
          id: userProfile.id,
          address: userProfile.address,
          alpha2CountryCode: userProfile.alpha2CountryCode,
          city: userProfile.city,
          email: this.user.email,
          phoneNumber: userProfile.phoneNumber,
          scope: this.user.scope,
          state: userProfile.state,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          profileImageUrl: this.user.profileImageUrl,
        } as IUser;
        this.authService.UpdateUser(userUpdate);
        this.isSubmited = false;
      },
      (err) => {
        this.isSubmited = false;
      }
    );
  }

  onVerfiyPhoneNumber() {
    this.isFetchingOtp = true;
    const formatedPhoneNumber =
      this.profileForm.get('countryCode').value.toString() +
      this.profileForm.get('phoneNumber').value.toString();

    this.authService.sendPersonalPhoneOTP().subscribe({
      next: (data) => {
        this.isFetchingOtp = false;

        const dialogRef = this.dialog.open(OTPDialogComponent, {
          panelClass: 'otp_dialog',
          data: {
            type: 'phoneNumberOTP',
            payload: formatedPhoneNumber,
          },
        });
      },
      error: (err) => {
        this.isFetchingOtp = false;
        console.log(err);
      },
    });
  }

  onUpdateProfile() {
    if (this.profileForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const formattedPhoneNumber =
      this.profileForm.get('countryCode').value.toString() +
      this.profileForm.get('phoneNumber').value.toString();

    this.sellerService
      .updateSellerPersonalProfile({
        ...this.profileForm.value,
        phoneNumber: formattedPhoneNumber,
        profileImageUrl: this.profilePhotoUrl,
        alpha2CountryCode: this.profileForm.value.country,
        coverPhotoUrl: this.coverPhotoUrl,
      })
      .subscribe({
        next: (data) => {
          this.isSubmitting = false;
          this.showUserUpdateButtons = false;

          this.toast.success('Profile updated successfully');
        },
        error: (err) => {
          this.isSubmitting = false;

          console.log(err);
        },
      });
  }

  onCancelUpdate() {
    this.showUserUpdateButtons = false;
  }
}
