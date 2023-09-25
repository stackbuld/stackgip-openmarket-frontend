import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from '../../../../services/toastr.service';
import { UserService } from '../../../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
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
  showUserUpdateButtons: boolean = false;
  selectedState!: string;

  user = {} as IUser;
  userId: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toast: ToastrService,
    private authService: AuthService,
    private sellerService: SellerService,
    private dialog: MatDialog
  ) {}

  get f() {
    return this.profileForm.controls;
  }
  ngOnInit(): void {
    this.isFetching = true;

    this.states = nigeriaSates.map((a) => a.name);
    this.states.unshift('Select a state');

    this.profileForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
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

        this.profileForm.setValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          bio: this.user.bio,
          phoneNumber: this.user.phoneNumber,
          country: this.user.alpha2CountryCode,
          state: this.user.state,
        });
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

        console.log(err);
      },
    });
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

  getStateValue() {
    localStorage.setItem('selectedState', this.selectedState);
  }

  onVerfiyPhoneNumber() {
    console.log(1);

    this.sellerService.verifyPhoneNumber().subscribe((data) => {
      console.log(data);
    });
  }

  onUpdateProfile() {
    if (this.profileForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.sellerService
      .updateSellerPersonalProfile({
        ...this.profileForm.value,
        profileImageUrl: 'test',
        alpha2CountryCode: 'Nigeria',
      })
      .subscribe({
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
