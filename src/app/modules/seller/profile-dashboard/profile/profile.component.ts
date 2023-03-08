import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from '../../../../services/toastr.service';
import { UserService } from '../../../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { nigeriaSates } from 'src/app/data/nigeriastates';
import { IUpdateUser, IUser } from 'src/app/models/IUserModel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  states = nigeriaSates.map((a) => a.name);
  isSubmited = false;

  user = {} as IUser;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toast: ToastrService,
    private authService: AuthService
  ) {
    this.user = this.authService.getLoggedInUser();
  }

  get f() {
    return this.profileForm.controls;
  }
  ngOnInit(): void {
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
        const userUpdate: IUser = {
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
        };
        this.authService.UpdateUser(userUpdate);
        this.isSubmited = false;
      },
      (err) => {
        this.isSubmited = false;
      }
    );
  }
}
