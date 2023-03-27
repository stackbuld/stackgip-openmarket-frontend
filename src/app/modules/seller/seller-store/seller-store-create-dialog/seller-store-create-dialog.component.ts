import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerStoreService } from 'src/app/shared/services/seller-store.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-seller-store-create-dialog',
  templateUrl: './seller-store-create-dialog.component.html',
  styleUrls: ['./seller-store-create-dialog.component.scss'],
})
export class SellerStoreCreateDialogComponent implements OnInit {
  mode: string = 'create';
  options = {
    types: [],
    }

  constructor(
    private fb: FormBuilder,
    private sellerStoreService: SellerStoreService,
    private dialogRef: MatDialogRef<SellerStoreCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helperService: HelperService
  ) {}

  sellerStoreAddressForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    console.log(this.data)
    this.sellerStoreAddressForm = this.fb.group({
      id: [''],
      streetName: ['', [Validators.required]],
      fullAddress: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      city: ['', [Validators.required]],
      landmark: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      isDefault: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      contactPhoneNumber: ['', [Validators.required]],
    });
    this.checkMode();
  }

  checkMode() {
    if (this.data) {
      this.mode = 'edit';
      this.sellerStoreAddressForm = this.fb.group({
        id: [this.data.id, Validators.required],
        streetName: [this.data.streetName, [Validators.required]],
        fullAddress: [this.data.fullAddress, [Validators.required]],
        lat: [this.data.lat, [Validators.required]],
        lng: [this.data.lng, [Validators.required]],
        city: [this.data.city, [Validators.required]],
        landmark: [this.data.landmark, [Validators.required]],
        postalCode: [this.data.postalCode, [Validators.required]],
        state: [this.data.state, [Validators.required]],
        country: [this.data.country, [Validators.required]],
        isDefault: [this.data.isDefault, [Validators.required]],
        userId: [this.data.userId, [Validators.required]],
        contactPhoneNumber: [this.data.contactPhoneNumber, [Validators.required]],
      });
      return;
    }
    this.mode = 'create';
    this.sellerStoreAddressForm = this.fb.group({
      streetName: ['', [Validators.required]],
      fullAddress: ['', [Validators.required]],
      lat: ['100', [Validators.required]],
      lng: ['100', [Validators.required]],
      city: ['', [Validators.required]],
      landmark: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      isDefault: ['', [Validators.required]],
      userId: [this.helperService.getLoggedInUserId(), [Validators.required]],
      contactPhoneNumber: ['', [Validators.required]],
    });
  }
  handleAddressChange(address: Address) {
    console.log(address)
  }

  onSave() {
    if (this.mode == 'create') {
      this.onCreate();
      return;
    }
    this.onEdit();
  }

  onCreate() {
    this.sellerStoreService.createSellerStore(
      this.sellerStoreAddressForm.value
    ).subscribe((response: any) => {
      response.status == "success" ? this.dialogRef.close(response) : null
    })
  }

  onEdit() {
    this.sellerStoreService.updateSellerStore(
      this.sellerStoreAddressForm.value
    ).subscribe((response: any) => {
      console.log(response)
      response.status == "success" ? this.dialogRef.close(response) : null
    })
  }
}
