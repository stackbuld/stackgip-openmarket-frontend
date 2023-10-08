import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CountryInfo } from 'src/app/models/country.model';
import { CountryService } from 'src/app/services/country/country.service';
import { nigeriaSates } from 'src/app/data/nigeriastates';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { IUser } from 'src/app/models/IUserModel';
import { Subscription } from 'rxjs';

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
  isEditingSub$: Subscription;
  isEditing: boolean;
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
        console.log(data);
      },
    });

    this.addressForm = new FormGroup({
      countryCode: new FormControl('+234'),
      fullName: new FormControl(null, Validators.required),
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

  toggle() {
    this.isToggled = !this.isToggled;
  }

  onSubmit() {}
}
