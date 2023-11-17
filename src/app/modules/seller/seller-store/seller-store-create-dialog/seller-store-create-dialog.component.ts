import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerStoreService } from 'src/app/shared/services/seller-store.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelperService } from 'src/app/shared/services/helper.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import * as moment from 'moment';
import { ToastrService } from 'src/app/services/toastr.service';
import { SellerStores } from 'src/app/models/StoreModels';

@Component({
  selector: 'app-seller-store-create-dialog',
  templateUrl: './seller-store-create-dialog.component.html',
  styleUrls: ['./seller-store-create-dialog.component.scss'],
})
export class SellerStoreCreateDialogComponent implements OnInit {
  mode: string = 'create';
  private phonePattern = /^234[789][01]\d{8}$/;
  setter = 'Please type your store name';
  notReady = true;
  loading: boolean;
  times: string[] = [];
  days: string[] = [];
  isGoogleAddressSelected: boolean = false;
  presentTime: Date;

  constructor(
    private fb: FormBuilder,
    private sellerStoreService: SellerStoreService,
    private dialogRef: MatDialogRef<SellerStoreCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private modalInfo: { data: SellerStores; mode: string },
    private helperService: HelperService,
    private toastr: ToastrService
  ) {}

  sellerStoreAddressForm: FormGroup = new FormGroup({});

  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  options: any = {
    types: ['address'],
    componentRestrictions: { country: 'NG' },
  };

  ngOnInit(): void {
    this.times = this.sellerStoreService.getTimes();
    this.days = this.sellerStoreService.days;

    this.presentTime = new Date();

    this.sellerStoreAddressForm = this.fb.group({
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
      contactPhoneNumber: ['', [Validators.required]],
      storeAvailabilties: this.fb.array([
        this.fb.group({
          dayOfWeek: ['Monday', Validators.required],
          openingTime: [this.presentTime, Validators.required],
          closingTime: [this.presentTime, Validators.required],
        }),
      ]),
    });

    if (this.modalInfo.mode === 'edit') {
      this.isGoogleAddressSelected = true;
      this.setter = this.modalInfo.data.fullAddress;

      this.sellerStoreAddressForm.patchValue({
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
        contactPhoneNumber: this.modalInfo.data.contactPhoneNumber,
      });

      while (this.storeAvailability.length != 0) {
        this.storeAvailability.removeAt(0);
      }

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
  }

  getTimeForTimeEdit(time: string) {
    const newTime = new Date();

    const [hours, minutes] = time.split(':');

    newTime.setHours(Number(hours), Number(minutes), 0, 0);

    return newTime;
  }

  setAddressField = () => {
    this.notReady = false;
  };

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

  onAddAvailability() {
    this.storeAvailability.push(
      this.fb.group({
        dayOfWeek: ['Monday', Validators.required],
        openingTime: [this.presentTime, Validators.required],
        closingTime: [this.presentTime, Validators.required],
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
    if (this.sellerStoreAddressForm.invalid) {
      this.helperService.validateAllFormFields(this.sellerStoreAddressForm);
      return;
    }

    this.sellerStoreAddressForm.value.storeAvailabilties.map((availability) => {
      const { openingTime, closingTime } = availability;

      availability.openingTime =
        this.sellerStoreService.getMainTime(openingTime);
      availability.closingTime =
        this.sellerStoreService.getMainTime(closingTime);
    });

    if (this.modalInfo.mode == 'create') {
      this.onCreate(this.sellerStoreAddressForm.value);
      return;
    }
    this.onEdit(this.sellerStoreAddressForm.value);
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
