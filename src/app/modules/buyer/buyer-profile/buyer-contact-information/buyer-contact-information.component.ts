import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryInfo } from 'src/app/models/country.model';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-buyer-contact-information',
  templateUrl: './buyer-contact-information.component.html',
  styleUrls: ['./buyer-contact-information.component.scss'],
})
export class BuyerContactInformationComponent implements OnInit {
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
      phoneNumber: new FormControl(null, Validators.required),
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  changeOption(e: any) {
    this.contactForm.patchValue({ countryCodes: e.target.value });
  }

  onSubmit() {}
}
