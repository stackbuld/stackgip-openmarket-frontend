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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  states: string[] = [];
  isSubmited = false;
  selectedState!: string;

  user = {} as IUser;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toast: ToastrService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.user = this.authService.getLoggedInUser();
  }

  get f() {
    return this.profileForm.controls;
  }
  ngOnInit(): void {
    this.states = nigeriaSates.map((a) => a.name);
    this.states.unshift('Select a state');

    this.selectedState =
      localStorage.getItem('selectedState') || 'Select a state';

    const userJson = this.user;
    this.profileForm = this.fb.group({
      firstname: [userJson.firstName, [Validators.required]],
      lastname: [userJson.lastName, [Validators.required]],
      email: [userJson.email, [Validators.required, Validators.email]],
      phoneNumber: [userJson.phoneNumber, [Validators.required]],
      address: [userJson.address, [Validators.required]],
      country: [userJson.alpha2CountryCode, [Validators.required]],
      state: [userJson.state, [Validators.required]],
      city: [userJson.city, [Validators.required]],
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
}
