import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { nigeriaSates } from 'src/app/data/nigeriastates';
import { CountryInfo } from 'src/app/models/country.model';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-m-buyer-address-information',
  templateUrl: './m-buyer-address-information.component.html',
  styleUrls: ['./m-buyer-address-information.component.scss'],
})
export class MBuyerAddressInformationComponent implements OnInit {
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
}
