import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CountryInfo } from 'src/app/models/country.model';
import { AuthService } from 'src/app/services/auth.service';
import { CountryService } from 'src/app/services/country/country.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-buyer-contact-information',
  templateUrl: './buyer-contact-information.component.html',
  styleUrls: ['./buyer-contact-information.component.scss'],
})
export class BuyerContactInformationComponent implements OnInit, OnDestroy {
  countryInfo: CountryInfo[];
  contactForm: FormGroup;
  isEditingSub$: Subscription;
  isEditing: boolean;
  constructor(
    private countryService: CountryService,
    private authService: AuthService,
    private userService: UserService
  ) {}

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

    this.isEditingSub$ = this.userService.isEditingUserInfo.subscribe({
      next: (status) => {
        this.isEditing = status;
      },
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  changeOption(e: any) {
    this.contactForm.patchValue({ countryCodes: e.target.value });
  }

  onSubmit() {}

  ngOnDestroy(): void {
    this.userService.isEditingUserInfo.next(false);

    this.isEditingSub$.unsubscribe();
  }
}
