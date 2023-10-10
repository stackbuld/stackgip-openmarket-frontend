import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CountryInfo } from 'src/app/models/country.model';
import { CountryService } from 'src/app/services/country/country.service';
import { nigeriaSates } from 'src/app/data/nigeriastates';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { IUser, UserAddressData } from 'src/app/models/IUserModel';
import { Observable, Subscription, retry } from 'rxjs';
import { log } from 'console';
import { ToastrService } from 'src/app/services/toastr.service';

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
  userAddresses: UserAddressData[] = [];
  isFetching: boolean = false;
  isEditingSub$: Subscription;
  userAddress: UserAddressData;
  isEditing: boolean = false;
  isEditingAddress: boolean = false;
  isDefault: boolean = false;
  isSubmitting: boolean = false;
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

    this.updateAddresses();

    this.isEditingSub$ = this.userService.isEditingUserInfo.subscribe({
      next: (status) => {
        this.isEditing = status;
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
          console.log(data);
          this.userAddresses = data;
        },
        error: (err) => {
          console.log(err);
          this.isFetching = false;

          this.toast.error('Something went wrong!');
        },
      });
  }

  trackByFn(index, item) {
    return index;
  }

  changeOption(e: any) {
    this.addressForm.patchValue({ countryCodes: e.target.value });
  }

  toggle(id: string) {
    const address = this.userAddresses.find((address) => {
      return address.id == id;
    });

    if (address.isDefault == true) {
      return;
    }
    this.isFetching = true;
    // this.isToggled = !this.isToggled;

    this.userService
      .updateUserAddress(id, { ...address, isDefault: true })
      .subscribe({
        next: (data) => {
          this.toast.success('Default address updated successfully!');
          this.updateAddresses();
        },
        error: (err) => {
          this.toast.error('Something went wrong!');
          console.log(err);
        },
      });
  }

  onAddAddress() {
    this.isEditing = true;
  }

  onSetAsDefault() {
    this.isDefault = !this.isDefault;
  }

  onEditAddress(id: string) {
    this.isEditing = true;
    this.isEditingAddress = true;
    const address = this.userAddresses.find((address) => {
      return address.id == id;
    });

    this.userAddress = address;

    const phoneNumber = address.contactPhoneNumber;
    const phoneNumberOnly = phoneNumber.slice(-10);
    const countryCode = phoneNumber.slice(0, -10);
    console.log(countryCode, phoneNumberOnly);

    this.addressForm.setValue({
      countryCode: countryCode,
      firstName: address.firstname,
      lastName: address.lastname,
      phoneNumber: phoneNumberOnly,
      additionalPhoneNumber: phoneNumberOnly,
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

        this.updateAddresses();
      },
      error: (err) => {
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
      lat: 0,
      lng: 0,
      city: 'test',
      state: formValue.state,
      country: formValue.country,
      userId: this.userId,
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
            this.isSubmitting = false;
            this.toast.success('Address updated!');
            console.log(data);

            this.updateAddresses();
          },
          error: (err) => {
            this.isSubmitting = false;
            this.toast.error('Something went wrong!');
          },
        });
    } else {
      this.userService.addUserAddress(data).subscribe({
        next: (data) => {
          this.toast.success('New address added!');

          this.isEditing = false;
          this.isEditingAddress = false;
          this.isSubmitting = false;

          this.updateAddresses();
          // if (this.isDefault) {
          //   const address = this.userAddresses.find((address) => {
          //     return address.fullAddress == data.data.fullAddress;
          //   });
          //   console.log(address);

          //   this.userService
          //     .updateUserAddress(address.id, {
          //       ...address,
          //       isDefault: true,
          //     })
          //     .subscribe({
          //       next: (data) => {
          //         this.updateAddresses();
          //       },
          //       error: (err) => {},
          //     });
          // }
          console.log(data);
          this.addressForm.reset();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error('Address already exists');
        },
      });
    }
  }
}
