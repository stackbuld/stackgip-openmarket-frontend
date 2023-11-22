import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SellerStoreService } from 'src/app/shared/services/seller-store.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelperService } from 'src/app/shared/services/helper.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import * as moment from 'moment';
import { ToastrService } from 'src/app/services/toastr.service';
import { SellerStores, StoreAvailability } from 'src/app/models/StoreModels';
import { CountryInfo } from 'src/app/models/country.model';
import { CountryService } from 'src/app/services/country/country.service';
import { count } from 'console';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';

@Component({
  selector: 'app-seller-store-create-dialog',
  templateUrl: './seller-store-create-dialog.component.html',
  styleUrls: ['./seller-store-create-dialog.component.scss'],
})
export class SellerStoreCreateDialogComponent implements OnInit {
  sellerStoreAddressForm: FormGroup = new FormGroup({});
  mode: string = 'create';
  private phonePattern = /^234[789][01]\d{8}$/;
  setter = 'Please type your store name';
  notReady = true;
  loading: boolean;
  times: string[] = [];
  days: string[] = [];
  isGoogleAddressSelected: boolean = false;
  presentTime: Date;
  countryInfo: CountryInfo[] = [];
  storeAvailabilties: StoreAvailability[] = [];
  isEditing: boolean[] = [];
  editingIndex: number;

  constructor(
    private fb: FormBuilder,
    private sellerStoreService: SellerStoreService,
    private dialogRef: MatDialogRef<SellerStoreCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private modalInfo: { data: SellerStores; mode: string },
    private helperService: HelperService,
    private toastr: ToastrService,
    private countryService: CountryService
  ) {}

  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  options: any = {
    types: ['address'],
    componentRestrictions: { country: 'NG' },
  };

  ngOnInit(): void {
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

    this.days = this.sellerStoreService.days;

    this.sellerStoreAddressForm = this.fb.group({
      countryCode: ['+234'],
      storeName: ['', [Validators.required]],
      streetName: [''],
      fullAddress: ['', [Validators.required]],
      lat: ['100', [Validators.required]],
      lng: ['100', [Validators.required]],
      city: ['', [Validators.required]],
      landmark: [''],
      postalCode: [''],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      isDefault: [false],
      userId: [this.helperService.getLoggedInUserId(), [Validators.required]],
      contactPhoneNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(10),
        ],
      ],
      storeAvailabilties: this.fb.array([]),
    });

    this.days.forEach((day) => {
      this.AddAvailability(day);
    });

    if (this.modalInfo.mode === 'edit') {
      this.isGoogleAddressSelected = true;
      this.setter = this.modalInfo.data.fullAddress;
      console.log(this.modalInfo.data);

      const phoneNumber = this.modalInfo.data.contactPhoneNumber.slice(-10);
      let countryCode = this.modalInfo.data.contactPhoneNumber.slice(0, -10);
      if (countryCode.charAt(0) !== '+') {
        countryCode = '+234';
      }

      this.sellerStoreAddressForm.patchValue({
        countryCode: countryCode,
        id: this.modalInfo.data.id,
        storeName: this.modalInfo.data.storeName,
        fullAddress: this.modalInfo.data.fullAddress,
        lat: this.modalInfo.data.lat,
        lng: this.modalInfo.data.lng,
        city: this.modalInfo.data.city,
        landmark: this.modalInfo.data.landmark,
        postalCode: this.modalInfo.data.postalCode,
        state: this.modalInfo.data.state,
        country: this.modalInfo.data.country,
        isDefault: this.modalInfo.data.isDefault,
        userId: this.modalInfo.data.userId,
        contactPhoneNumber: phoneNumber,
      });

      while (this.storeAvailability.length != 0) {
        this.storeAvailability.removeAt(0);
      }

      this.days.forEach((day) => {
        this.AddAvailability(day);
      });

      console.log(this.storeAvailability);

      this.modalInfo.data.storeAvailabilties.forEach((availability) => {
        const openingTime = this.getTimeForTimeEdit(availability.openingTime);
        const closingTime = this.getTimeForTimeEdit(availability.closingTime);

        this.storeAvailability.push(
          this.fb.group({
            dayOfWeek: [availability.dayOfWeek, Validators.required],
            openingTime: [openingTime, Validators.required],
            closingTime: [closingTime, Validators.required],
          })
        );
      });
    }

    this.sellerStoreAddressForm
      .get('fullAddress')
      .valueChanges.subscribe((value) => {
        if (!value || value == '') {
          this.isGoogleAddressSelected = false;
        }
      });

    this.storeAvailability.valueChanges.subscribe((value) => {
      this.sellerStoreService.addAvailability(value);
      this.storeAvailabilties = value;

      localStorage.setItem('test', JSON.stringify(this.storeAvailabilties));

      if (this.storeAvailabilties[this.editingIndex]?.closingTime !== null) {
        this.isEditing[this.editingIndex] = false;
      }
      console.log(this.storeAvailabilties);
    });

    if (localStorage.getItem('test')) {
      this.storeAvailabilties = JSON.parse(localStorage.getItem('test'));
      console.log(this.storeAvailabilties);
    }

    // this.sellerStoreService.storeAvailabilitiesSubj.subscribe((value) => {
    //   this.storeAvailabilties = value;
    // });
  }

  isEditingAvail(index: number) {
    this.isEditing[index] = !this.isEditing[index];
    this.editingIndex = index;
  }

  deleteAvail(index: number) {
    this.isEditing[index] = false;
    // this.storeAvailability.controls.forEach((control, controlIndex) => {
    //   if (controlIndex == index) {
    //     control.patchValue({ openingTime: null, closingTime: null });
    //   }
    // });

    this.storeAvailabilties.map((avail, availIndex) => {
      if (availIndex == index) {
        avail.closingTime = null;
        avail.openingTime = null;
      }
    });
    localStorage.setItem('test', JSON.stringify(this.storeAvailabilties));
  }

  getTimeForTimeEdit(time: string) {
    const newTime = new Date();

    const [hours, minutes] = time.split(':');

    newTime.setHours(Number(hours), Number(minutes), 0, 0);

    return newTime;
  }

  changeOption(e: any) {
    this.sellerStoreAddressForm.patchValue({ countryCode: e.target.value });
  }

  setAddressField = () => {
    this.notReady = false;
  };

  get countryCode() {
    return <FormControl>this.sellerStoreAddressForm.get('countryCode');
  }

  get storeName() {
    return this.sellerStoreAddressForm.get('storeName');
  }

  get fullAddress() {
    return this.sellerStoreAddressForm.get('fullAddress');
  }

  get streetName() {
    return this.sellerStoreAddressForm.get('streetName');
  }

  get lat() {
    return this.sellerStoreAddressForm.get('lat');
  }

  get lng() {
    return this.sellerStoreAddressForm.get('lng');
  }

  get city() {
    return this.sellerStoreAddressForm.get('city');
  }

  get state() {
    return this.sellerStoreAddressForm.get('state');
  }

  get landmark() {
    return this.sellerStoreAddressForm.get('landmark');
  }

  get postalCode() {
    return this.sellerStoreAddressForm.get('postalCode');
  }

  get country() {
    return this.sellerStoreAddressForm.get('country');
  }

  get contactPhoneNumber() {
    return this.sellerStoreAddressForm.get('contactPhoneNumber');
  }

  get storeAvailability() {
    return <FormArray>this.sellerStoreAddressForm.get('storeAvailabilties');
  }

  AddAvailability(day: string) {
    this.storeAvailability.push(
      this.fb.group({
        dayOfWeek: [day],
        openingTime: [null],
        closingTime: [null],
      })
    );
  }

  onRemoveAvailability(index: number) {
    if (this.storeAvailability.length <= 1) {
      return;
    }
    this.storeAvailability.removeAt(index);
  }

  public handleAddressChange(address: Address) {
    this.isGoogleAddressSelected = true;
    let postalCode = address.address_components.filter((element) => {
      return element.types.includes('postal_code');
    });
    let streetName = address.address_components.filter((element) => {
      return element.types.includes('route');
    });
    let country = address.address_components.filter((element) => {
      return element.types.includes('country');
    });
    let city = address.address_components.filter((element) => {
      return element.types.includes('administrative_area_level_2');
    });
    let state = address.address_components.filter((element) => {
      return element.types.includes('administrative_area_level_1');
    });
    let landmark = address.address_components.filter((element) => {
      return element.types.includes('locality');
    });
    this.fullAddress.patchValue(address.formatted_address);
    this.lng.patchValue(address.geometry.location.lng());
    this.lat.patchValue(address.geometry.location.lat());
    this.postalCode.patchValue(postalCode[0].long_name);
    this.streetName.patchValue(streetName[0].long_name);
    this.country.patchValue(country[0].long_name);
    this.city.patchValue(city[0].long_name);
    this.state.patchValue(state[0].long_name);
    this.landmark.patchValue(landmark[0].long_name);
    this.sellerStoreAddressForm.updateValueAndValidity();
  }

  onSave() {
    if (!this.isGoogleAddressSelected) {
      this.toastr.warining(
        'Select an address from the options that shows as you type'
      );
      return;
    }

    if (this.storeAvailabilties.length == 0) {
      this.toastr.warining('You need to add at least one availability');
      return;
    }

    if (this.sellerStoreAddressForm.invalid) {
      this.helperService.validateAllFormFields(this.sellerStoreAddressForm);
      return;
    }

    const formValue = this.sellerStoreAddressForm.value;
    const phoneNumber = this.sellerStoreAddressForm.value.contactPhoneNumber
      .slice(-10)
      .toString();

    const formattedPhoneNumber =
      this.countryCode.value.toString() + phoneNumber;

    // this.sellerStoreAddressForm.value.storeAvailabilties.map((availability) => {
    //   const { openingTime, closingTime } = availability;

    //   availability.openingTime =
    //     this.sellerStoreService.getMainTime(openingTime);
    //   availability.closingTime =
    //     this.sellerStoreService.getMainTime(closingTime);
    // });

    this.storeAvailabilties = this.storeAvailabilties.filter((availability) => {
      if (
        availability.openingTime !== null &&
        availability.closingTime !== null
      ) {
        availability.openingTime = this.sellerStoreService.convertTo24Hours(
          availability.openingTime
        );

        availability.closingTime = this.sellerStoreService.convertTo24Hours(
          availability.closingTime
        );
        return availability;
      }
    });
    console.log({
      ...this.sellerStoreAddressForm.value,
      storeAvailabilties: this.storeAvailabilties,
    });

    if (this.modalInfo.mode == 'create') {
      this.onCreate({
        ...this.sellerStoreAddressForm.value,
        storeAvailabilties: this.storeAvailabilties,
        contactPhoneNumber: formattedPhoneNumber,
      });
      return;
    }
    this.onEdit({
      ...this.sellerStoreAddressForm.value,
      storeAvailabilties: this.storeAvailabilties,
      contactPhoneNumber: formattedPhoneNumber,
    });
  }

  onCreate(form) {
    this.loading = true;
    this.sellerStoreService.createSellerStore(form).subscribe({
      next: (response: any) => {
        this.loading = false;
        response.status == 'success' ? this.dialogRef.close(response) : null;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  preventLetter(evt: any): boolean {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }

  onEdit(form) {
    this.loading = true;
    this.sellerStoreService.updateSellerStore(form).subscribe({
      next: (response: any) => {
        this.loading = false;
        response.status == 'success' ? this.dialogRef.close(response) : null;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
}
