import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CountryInfo } from 'src/app/models/country.model';
import { CountryService } from 'src/app/services/country/country.service';
import { nigeriaSates } from 'src/app/data/nigeriastates';

@Component({
  selector: 'app-buyer-address-information',
  templateUrl: './buyer-address-information.component.html',
  styleUrls: ['./buyer-address-information.component.scss'],
})
export class BuyerAddressInformationComponent implements OnInit {
  isToggled: boolean = false;
  states: string[] = [];

  countryInfo: CountryInfo[];
  addressForm: FormGroup;
  constructor(private countryService: CountryService) {}

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
