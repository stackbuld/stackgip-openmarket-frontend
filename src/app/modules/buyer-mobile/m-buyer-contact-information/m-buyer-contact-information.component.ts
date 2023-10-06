import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CountryInfo } from 'src/app/models/country.model';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-m-buyer-contact-information',
  templateUrl: './m-buyer-contact-information.component.html',
  styleUrls: ['./m-buyer-contact-information.component.scss'],
})
export class MBuyerContactInformationComponent implements OnInit {
  countryInfo: CountryInfo[];
  contactForm: FormGroup;
  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getCountry().subscribe({
      next: (data) => {
        this.countryInfo = data;
        console.log(data);
      },
    });

    this.contactForm = new FormGroup({
      countryCode: new FormControl('+234'),
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  changeOption(e: any) {
    this.contactForm.patchValue({ countryCodes: e.target.value });
  }
}
