import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/IUserModel';
import { CountryInfo } from 'src/app/models/country.model';
import { AuthService } from 'src/app/services/auth.service';
import { CountryService } from 'src/app/services/country/country.service';
import { UserService } from 'src/app/services/user/user.service';
import { BuyerContactDialogComponent } from './buyer-contact-dialog/buyer-contact-dialog.component';
import { ToastrService } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-buyer-contact-information',
  templateUrl: './buyer-contact-information.component.html',
  styleUrls: ['./buyer-contact-information.component.scss'],
})
export class BuyerContactInformationComponent implements OnInit, OnDestroy {
  countryInfo: CountryInfo[];
  contactForm: FormGroup;
  isEditingSub$: Subscription;
  isEditing: boolean;
  userId: string;
  user: IUser;
  isFetching: boolean = false;
  isSubmitting: boolean = false;
  isPhoneVerified: boolean = false;
  specificUserData;
  constructor(
    private countryService: CountryService,
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.updateUser();

    this.countryService.getCountry().subscribe({
      next: (data) => {
        this.countryInfo = data;
      },
    });

    this.contactForm = new FormGroup({
      countryCode: new FormControl('+234'),
      phoneNumber: new FormControl(null, Validators.required),
    });

    this.isEditingSub$ = this.userService.isEditingUserInfo.subscribe({
      next: (status) => {
        this.isEditing = status;
      },
    });

    this.userService.isPhoneVerified.subscribe(
      (status) => (this.isPhoneVerified = status)
    );
  }

  updateUser() {
    this.userId = this.authService.getLoggedInUser().id;

    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user.data;
        this.isPhoneVerified = this.user.phoneNumberConfirmed;
        this.isFetching = false;

        this.specificUserData = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          profileImageUrl: this.user.profileImageUrl,
          phoneNumber: this.user.phoneNumber,
        };
      },
      error: (err) => {
        this.isFetching = false;
      },
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  changeOption(e: any) {
    this.contactForm.patchValue({ countryCodes: e.target.value });
  }

  onVerify() {
    this.isSubmitting = true;

    this.authService.sendPersonalPhoneOTP().subscribe({
      next: (data) => {
        this.isSubmitting = false;

        const dialogRef = this.dialog.open(BuyerContactDialogComponent, {
          panelClass: 'contact_dialog',
          data: {
            type: 'phoneNumberOTP',
            payload: this.user.phoneNumber,
          },
        });
      },
      error: (err) => {
        this.isSubmitting = false;
      },
    });
  }

  onEdit() {
    this.isEditing = true;
    this.userService.isEditingUserInfo.next(true);
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    let phoneNumber = this.contactForm.get('phoneNumber').value.toString();

    this.contactForm.get('phoneNumber').value.toString();
    phoneNumber = phoneNumber.replace(/^0+/, '');
    const formattedPhoneNumber =
      this.contactForm.get('countryCode').value.toString() + phoneNumber;

    this.userService
      .updateUser({
        ...this.specificUserData,
        phoneNumber: formattedPhoneNumber,
      })
      .subscribe({
        next: (data) => {
          this.isSubmitting = false;
          this.isEditing = false;
          this.userService.isEditingUserInfo.next(false);
          this.userService.userProfileUpdated.next(true);
          this.toast.success('Phone Number Updated!');

          this.updateUser();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error('Something went wrong! Try again later.');
        },
      });
  }

  ngOnDestroy(): void {
    this.userService.isEditingUserInfo.next(false);

    this.isEditingSub$.unsubscribe();
  }
}
