import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {IUser, UserAddressData} from "../../../../models/IUserModel";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {CountryService} from "../../../../services/country/country.service";
import {CountryInfo} from "../../../../models/country.model";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-single-product-address-dialog',
    templateUrl: './single-product-address-dialog.component.html',
    styleUrls: ['./single-product-address-dialog.component.scss']
})
export class SingleProductAddressDialogComponent implements OnInit {
    user: IUser;
    isInformation: boolean = false
    loadingAddress: boolean = false
    isEditingAddress: boolean = false
    addressForm: FormGroup;
    options: any = {
        types: ['address'],
        componentRestrictions: {country: 'NG'},
    };
    isGoogleAddressSelected: boolean = false
    countryInfo: CountryInfo[] = [];


    constructor(private authService: AuthService, private countryService: CountryService, private toastService: ToastrService) {
    }

    get formControls() {
        return this.addressForm.controls;
    }

    ngOnInit() {
        const countryCodes = JSON.parse(localStorage.getItem('countryCodesInfo')!);

        if (countryCodes) {
            this.countryInfo = countryCodes;
        } else {
            this.countryService.getCountry().subscribe({
                next: (data) => {
                    this.countryInfo = data;
                },
            });
        }
    }

    initAddressForm() {
        this.addressForm = new FormGroup({
            firstname: new FormControl('', Validators.required),
            lastname: new FormControl('', Validators.required),
            fullAddress: new FormControl(''),
            lat: new FormControl(''),
            lng: new FormControl(''),
            city: new FormControl(''),
            state: new FormControl(''),
            country: new FormControl(''),
            userId: new FormControl(null),
            countryCode: new FormControl('+234'),
            contactPhoneNumber: new FormControl('', Validators.required),
        });
    };

    changeOption(e: any) {
        this.addressForm.patchValue({countryCode: e.target.value});
    }

    public handleAddressChange(address: Address | any) {
        this.isGoogleAddressSelected = true;

        const country = address.address_components.filter((element) => {
            return element.types.includes('country');
        });
        const city = address.address_components.filter((element) => {
            return element.types.includes('administrative_area_level_2');
        });
        const state = address.address_components.filter((element) => {
            return element.types.includes('administrative_area_level_1');
        });
        const landmark = address.address_components.filter((element) => {
            return element.types.includes('locality');
        });
        const postalCode = address.address_components.filter((element) => {
            return element.types.includes('postal_code');
        });
        const streetName = address.address_components.filter((element) => {
            return element.types.includes('route');
        });

        this.addressForm.patchValue({fullAddress: address.formatted_address});
        this.addressForm.patchValue({lng: address.geometry.location.lng()});
        this.addressForm.patchValue({lat: address.geometry.location.lat()});
        this.addressForm.patchValue({country: country[0].short_name});
        this.addressForm.patchValue({
            city: city.length > 0 ? city[0].long_name : state[0].long_name,
        });
        this.addressForm.patchValue({state: state[0].long_name});

        // this.landmark.patchValue(landmark[0].long_name);
        // this.postalCode.patchValue(postalCode[0].long_name);
        // this.streetName.patchValue(streetName[0].long_name);
    }

    toggleSocialModal = () => {
        this.authService.showSharedSocialModal();
    };

    // applyAddress = () => {
    //     if (this.addressForm.invalid) {
    //         this.toastService.warning('Fields can not be empty');
    //         return;
    //     }
    //
    //     if (!this.isGoogleAddressSelected) {
    //         this.toastService.warning(
    //             'Select your address from the list that shows while typing',
    //         );
    //         return;
    //     }
    //
    //     this.loadingAddress = true;
    //     this.setter = this.addressForm.value.fullAddress;
    //     const formValue = this.addressForm.value;
    //     const phoneNumber = this.addressForm.value.contactPhoneNumber
    //         .slice(-10)
    //         .toString();
    //     const formattedPhoneNumber =
    //         this.addressForm.get('countryCode').value.toString() + phoneNumber;
    //
    //     if (this.user !== null) {
    //         if (this.isEditingAddress) {
    //             let data: UserAddressData = {
    //                 firstname: formValue.firstname,
    //                 lastname: formValue.lastname,
    //                 fullAddress: formValue.fullAddress,
    //                 lat: this.currentAddress.lat as number,
    //                 contactPhoneNumber: formattedPhoneNumber,
    //                 lng: this.currentAddress.lng as number,
    //                 city: this.currentAddress.city,
    //                 state: formValue.state,
    //                 country: formValue.country,
    //                 userId: this.user.id,
    //                 isDefault: this.currentAddress.isDefault,
    //             };
    //
    //             this.getClosestSellerStore(data);
    //
    //             this.userService
    //                 .updateUserAddress(this.currentAddress.id, data)
    //                 .subscribe({
    //                     next: (res) => {
    //                         this.reloadAddresses();
    //                         this.loadingAddress = false;
    //                         document.getElementById('closeAddressFormDialog').click();
    //                         this.initAddressForm();
    //                     },
    //                     error: (err) => {
    //                     },
    //                 });
    //         } else {
    //             this.addressForm.patchValue({userId: this.user.id});
    //             const cartService$ = this.cartService.createAddress(
    //                 this.addressForm.value,
    //             );
    //             cartService$.subscribe({
    //                 next: (res) => {
    //                     if (res.status === 'success') {
    //                         this.toastService.success(
    //                             'Address created successfully',
    //                             'SUCCESS',
    //                         );
    //
    //                         localStorage.setItem(
    //                             'shippingAddress',
    //                             JSON.stringify({
    //                                 ...this.addressForm.value,
    //                                 contactPhoneNumber: formattedPhoneNumber,
    //                             }),
    //                         );
    //                         this.currentAddress = {
    //                             ...this.addressForm.value,
    //                             contactPhoneNumber: formattedPhoneNumber,
    //                         };
    //
    //                         this.getClosestSellerStore(this.currentAddress);
    //
    //                         this.reloadAddresses();
    //                         this.loadingAddress = false;
    //                         document.getElementById('closeAddressFormDialog').click();
    //                         this.initAddressForm();
    //                     } else {
    //                         this.loadingAddress = false;
    //                         this.toastService.error(res.message, 'ERROR');
    //                     }
    //                 },
    //                 error: (err) => {
    //                     this.loadingAddress = false;
    //                     this.toastService.error(err.message, 'ERROR');
    //                 },
    //             });
    //         }
    //     } else {
    //         this.loadingAddress = false;
    //         localStorage.setItem(
    //             'shippingAddress',
    //             JSON.stringify({
    //                 ...this.addressForm.value,
    //                 contactPhoneNumber: formattedPhoneNumber,
    //             }),
    //         );
    //         this.currentAddress = {
    //             ...this.addressForm.value,
    //             contactPhoneNumber: formattedPhoneNumber,
    //         };
    //
    //         this.getClosestSellerStore(this.currentAddress);
    //
    //         this.getShippingEstimate();
    //         this.toastService.success('Address saved!', 'SUCCESS');
    //         document.getElementById('closeAddressFormDialog').click();
    //     }
    // };

}
