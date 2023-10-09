import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CountryInfo } from 'src/app/models/country.model';
import { CountryService } from 'src/app/services/country/country.service';
import { nigeriaSates } from 'src/app/data/nigeriastates';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { IUser, UserAddressData } from 'src/app/models/IUserModel';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-buyer-address-information',
  templateUrl: './buyer-address-information.component.html',
  styleUrls: ['./buyer-address-information.component.scss'],
})
export class BuyerAddressInformationComponent implements OnInit {
  isToggled: boolean = false;
  states: string[] = [];
  userId: string;
  user: IUser;
  countryInfo: CountryInfo[];
  addressForm: FormGroup;
  userAddresses: Observable<UserAddressData[]>;
  isEditingSub$: Subscription;
  isEditing: boolean = false;
  constructor(
    private countryService: CountryService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.states = nigeriaSates.map((a) => a.name);
    this.states.unshift('Select a state');

    this.countryService.getCountry().subscribe({
      next: (data) => {
        this.countryInfo = data;
      },
    });

    this.addressForm = new FormGroup({
      countryCode: new FormControl('+234'),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null, Validators.required),
      additionalPhoneNumber: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
    });

    this.userId = this.authService.getLoggedInUser().id;

    // this.userService.getUserById(this.userId).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     this.user = data.data;
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
    this.userService.getUserAddress(this.userId).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.userAddresses = this.userService.getUserAddress(this.userId);

    this.isEditingSub$ = this.userService.isEditingUserInfo.subscribe({
      next: (status) => {
        this.isEditing = status;
      },
    });
  }

  get f() {
    return this.addressForm.controls;
  }

  trackByFn(index, item) {
    return index;
  }

  changeOption(e: any) {
    this.addressForm.patchValue({ countryCodes: e.target.value });
  }

  toggle(id: string) {
    this.isToggled = !this.isToggled;
  }

  onAddAddress() {
    this.isEditing = true;
  }

  onSubmit() {
    if (this.addressForm.invalid) {
      return;
    }

    const formValue = this.addressForm.value;

    const formattedPhoneNumber =
      this.addressForm.get('countryCode').value.toString() +
      this.addressForm.get('phoneNumber').value.toString();

    const data: UserAddressData = {
      firstname: formValue.firstName,
      lastname: formValue.lastName,
      fullAddress: formValue.address,
      contactPhoneNumber: formattedPhoneNumber,
      lat: 0,
      lng: 0,
      city: 'test',
      state: formValue.state,
      country: formValue.country,
      userId: this.userId,
    };

    console.log(data);

    this.userService.addUserAddress(this.userId, data).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
