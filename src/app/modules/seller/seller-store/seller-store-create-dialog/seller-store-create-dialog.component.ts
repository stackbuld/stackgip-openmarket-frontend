import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerStoreService } from 'src/app/shared/services/seller-store.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelperService } from 'src/app/shared/services/helper.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

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

  constructor(
    private fb: FormBuilder,
    private sellerStoreService: SellerStoreService,
    private dialogRef: MatDialogRef<SellerStoreCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helperService: HelperService
  ) {}

  sellerStoreAddressForm: FormGroup = new FormGroup({});

  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  options = {
    types: ['address'],
    // componentRestrictions: { country: 'NG' },
  };

  setAddressField = () => {
    this.notReady = false;
  }

  ngOnInit(): void {
    // this.sellerStoreAddressForm = this.fb.group({
    //   id: [''],
    //   streetName: ['', [Validators.required]],
    //   fullAddress: ['', [Validators.required]],
    //   lat: ['', [Validators.required]],
    //   lng: ['', [Validators.required]],
    //   city: ['', [Validators.required]],
    //   landmark: ['', [Validators.required]],
    //   postalCode: ['', [Validators.required]],
    //   state: ['', [Validators.required]],
    //   country: ['', [Validators.required]],
    //   isDefault: [''],
    //   userId: ['', [Validators.required]],
    //   contactPhoneNumber: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
    // });
    this.checkMode();
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

  public handleAddressChange(address: Address) {
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
  
  checkMode() {
    if (this.data) {
      this.mode = 'edit';
      this.setter = this.data.fullAddress;
      this.sellerStoreAddressForm = this.fb.group({
        id: [this.data.id, Validators.required],
        storeName: [this.data.storeName, [Validators.required]],
        streetName: [this.data.streetName, ],
        fullAddress: [this.data.fullAddress, [Validators.required]],
        lat: [this.data.lat, [Validators.required]],
        lng: [this.data.lng, [Validators.required]],
        city: [this.data.city, [Validators.required]],
        landmark: [this.data.landmark],
        postalCode: [this.data.postalCode, [Validators.required]],
        state: [this.data.state, [Validators.required]],
        country: [this.data.country, [Validators.required]],
        isDefault: [this.data.isDefault],
        userId: [this.data.userId, [Validators.required]],
        contactPhoneNumber: [this.data.contactPhoneNumber, [Validators.required]]
        // Validators.pattern(this.phonePattern)
      });
      return;
    }
    this.mode = 'create';
    this.sellerStoreAddressForm = this.fb.group({
      storeName: ['', [Validators.required]],
      streetName: ['', ],
      fullAddress: ['', [Validators.required]],
      lat: ['100', [Validators.required]],
      lng: ['100', [Validators.required]],
      city: ['', [Validators.required]],
      landmark: [''],
      postalCode: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      isDefault: [false],
      userId: [this.helperService.getLoggedInUserId(), [Validators.required]],
      contactPhoneNumber: ['', [Validators.required]],
      // Validators.pattern(this.phonePattern)
    });
  }

  onSave() {
    if (this.sellerStoreAddressForm.invalid) {
      this.helperService.validateAllFormFields(this.sellerStoreAddressForm);
      return;
    }
    if (this.mode == 'create') {
      this.onCreate();
      return;
    }
    this.onEdit();
  }

  onCreate() {
    this.loading = true;
    this.sellerStoreService
      .createSellerStore(this.sellerStoreAddressForm.value)
      .subscribe((response: any) => {
        this.loading = false;
        response.status == 'success' ? this.dialogRef.close(response) : null;
    }, err => {
      this.loading = false;
    });
  }

  preventLetter(evt: any): boolean {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }

  onEdit() {
    this.loading = true;
    this.sellerStoreService
      .updateSellerStore(this.sellerStoreAddressForm.value)
      .subscribe((response: any) => {
        this.loading = false;
        response.status == 'success' ? this.dialogRef.close(response) : null;
      }, err => {
        this.loading = false;
      });
  }
}
