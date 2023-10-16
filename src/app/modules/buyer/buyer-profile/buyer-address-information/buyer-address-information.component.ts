import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

import { CountryInfo } from 'src/app/models/country.model';
import { CountryService } from 'src/app/services/country/country.service';
import { nigeriaSates } from 'src/app/data/nigeriastates';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { IUser, UserAddressData } from 'src/app/models/IUserModel';
import { Observable, Subscription, retry, switchMap } from 'rxjs';
import { log } from 'console';
import { ToastrService } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-buyer-address-information',
  templateUrl: './buyer-address-information.component.html',
  styleUrls: ['./buyer-address-information.component.scss'],
})
export class BuyerAddressInformationComponent implements OnInit, OnDestroy {
  isToggled: boolean = false;
  states: string[] = [];
  userId: string;
  user: IUser;
  countryInfo: CountryInfo[];
  addressForm: FormGroup;
  userAddresses: UserAddressData[] = [];
  isFetching: boolean = false;
  isEditingSub$: Subscription;
  userAddress: UserAddressData;
  isEditing: boolean = false;
  isEditingAddress: boolean = false;
  isDefault: boolean = false;
  isSubmitting: boolean = false;
  options = {
    types: ['address'],
    componentRestrictions: { country: 'NG' },
  };
  addressLatitude: number;
  addressLongitude: number;
  addressCity: string;
  fallbackAddressCity: string;
  constructor(
    private countryService: CountryService,
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.states = nigeriaSates.map((a) => a.name);

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
      address: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
    });

    this.userId = this.authService.getLoggedInUser().id;

    this.updateAddresses();

    this.isEditingSub$ = this.userService.isEditingUserInfo.subscribe({
      next: (status) => {
        this.isEditing = status;

        if (!status) {
          this.isEditingAddress = status;
          this.isDefault = status;
          this.addressForm.reset();
          this.addressForm.get('countryCode').setValue('+234');
        }
      },
    });
  }

  get f() {
    return this.addressForm.controls;
  }

  updateAddresses() {
    this.userService
      .getUserAddress(this.userId)
      .pipe(retry(1))
      .subscribe({
        next: (data) => {
          this.isFetching = false;
          this.userAddresses = data;
        },
        error: (err) => {
          this.isFetching = false;

          this.toast.error('Something went wrong!');
        },
      });
  }

  changeOption(e: any) {
    this.addressForm.patchValue({ countryCodes: e.target.value });
  }

  handleAddressChange(address: Address) {
    try {
      let state = address.address_components.filter((element) => {
        return element.types.includes('administrative_area_level_1');
      });

      let country = address.address_components.filter((element) => {
        return element.types.includes('country');
      });

      let city = address.address_components.filter((element) => {
        return element.types.includes('administrative_area_level_2');
      });
      let fallbackCity = address.address_components.filter((element) => {
        return element.types.includes('locality');
      });

      this.addressForm.get('address').patchValue(address.formatted_address);
      this.addressForm.get('state').patchValue(state[0].long_name);
      this.addressForm.get('country').patchValue(country[0].short_name);

      this.addressLatitude = address.geometry.location.lat();
      this.addressLongitude = address.geometry.location.lng();

      if (city.length == 0) {
        this.addressCity = state[0].long_name;
      } else {
        this.addressCity = city[0].long_name;
      }
    } catch {}
  }

  toggle(id: string) {
    const address = this.userAddresses.find((address) => {
      return address.id == id;
    });

    if (address.isDefault == true) {
      return;
    }
    this.isFetching = true;

    this.userService
      .updateUserAddress(id, { ...address, isDefault: true })
      .subscribe({
        next: (data) => {
          this.toast.success('Default address updated successfully!');
          this.updateAddresses();
        },
        error: (err) => {
          this.toast.error('Something went wrong!');
        },
      });
  }

  onAddAddress() {
    this.isEditing = true;
    this.userService.isEditingUserInfo.next(true);
  }

  onSetAsDefault() {
    this.isDefault = !this.isDefault;
  }

  onEditAddress(id: string) {
    this.isEditing = true;
    this.isEditingAddress = true;
    this.userService.isEditingUserInfo.next(true);
    const address = this.userAddresses.find((address) => {
      return address.id == id;
    });

    this.userAddress = address;
    this.isDefault = address.isDefault;
    console.log(address);

    const phoneNumber = address.contactPhoneNumber;
    const phoneNumberOnly = phoneNumber.slice(-10);
    const countryCode = phoneNumber.slice(0, -10);

    this.addressForm.setValue({
      countryCode: countryCode,
      firstName: address.firstname,
      lastName: address.lastname,
      phoneNumber: phoneNumberOnly,
      address: address.fullAddress,
      state: address.state,
      country: address.country,
    });
  }

  onDeleteAddress(id: string) {
    this.isFetching = true;
    const address = this.userAddresses.find((address) => {
      return address.id == id;
    });

    this.userService.deleteUserAddress(address.id).subscribe({
      next: (data) => {
        this.toast.success('Address Deleted!');
        console.log(data);

        if (address.isDefault) {
          this.userService
            .getUserAddress(this.userId)
            .pipe(
              retry(1),
              switchMap((data) => {
                return this.userService.updateUserAddress(data[0].id, {
                  ...data[0],
                  isDefault: true,
                });
              })
            )
            .subscribe({
              next: (data) => {
                this.updateAddresses();
              },
              error: (err) => {
                this.isFetching = false;

                this.toast.error('Something went wrong!');
              },
            });
        } else {
          this.updateAddresses();
        }
      },
      error: (err) => {
        this.isFetching = false;

        this.toast.error('Something went wrong!');
      },
    });
  }

  onSubmit() {
    if (this.addressForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    const formValue = this.addressForm.value;

    const formattedPhoneNumber =
      this.addressForm.get('countryCode').value.toString() +
      this.addressForm.get('phoneNumber').value.toString();

    const data: UserAddressData = {
      firstname: formValue.firstName,
      lastname: formValue.lastName,
      fullAddress: formValue.address,
      contactPhoneNumber: formattedPhoneNumber,
      lat: this.addressLatitude,
      lng: this.addressLongitude,
      city: this.addressCity,
      state: formValue.state,
      country: formValue.country,
      userId: this.userId,
      isDefault: this.isDefault,
    };

    if (this.isEditingAddress) {
      this.userService
        .updateUserAddress(this.userAddress.id, {
          ...this.userAddress,
          ...data,
        })
        .subscribe({
          next: (data) => {
            this.isEditing = false;
            this.isEditingAddress = false;
            this.userService.isEditingUserInfo.next(false);
            this.isSubmitting = false;
            this.toast.success('Address updated!');

            this.updateAddresses();
          },
          error: (err) => {
            this.isSubmitting = false;
            this.toast.error(err.error.message);
          },
        });
    } else {
      this.userService.addUserAddress(data).subscribe({
        next: (data) => {
          this.toast.success('New address added!');
          console.log(data);

          this.isEditing = false;
          this.isEditingAddress = false;
          this.userService.isEditingUserInfo.next(false);
          this.isSubmitting = false;

          this.updateAddresses();

          this.addressForm.reset();
        },
        error: (err) => {
          this.isSubmitting = false;

          this.toast.error(err.error.message);
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.isEditingSub$.unsubscribe();
    this.userService.isEditingUserInfo.next(false);
  }
}
