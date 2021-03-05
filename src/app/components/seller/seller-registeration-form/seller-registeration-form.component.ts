import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import uikit from "uikit";
import { nigeriaSates } from "src/app/data/nigeriastates";

@Component({
  selector: 'app-seller-registeration-form',
  templateUrl: './seller-registeration-form.component.html',
  styleUrls: ['./seller-registeration-form.component.css']
})
export class SellerRegisterationFormComponent implements OnInit {
  componentForm: FormGroup;
  states = nigeriaSates.map((a) => a.name.toLowerCase());
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log(nigeriaSates);
    this.initIt();
  }
  initIt() {
    this.componentForm = this.fb.group({
      businessName: [
        '',
        [
          Validators.required,
        ],
      ],
      businessPhone: [
        '',
        [
          Validators.required,
        ],
      ],
      businessEmail: [
        '',
        [
          Validators.required,
        ],
      ],
      businessAddress: [
        '',
        [
          Validators.required,
        ],
      ],
      businessRegistrationNumber: [
        '',
        [
          Validators.required,
        ],
      ],
      businessCountryCode: [
        '',
        [
          Validators.required,
        ],
      ],
      businessState: [
        '',
        [
          Validators.required,
        ],
      ],
      businessCity: [
        '',
        [
          Validators.required,
        ],
      ],
      businessLogoUrl: [
        '',
        [
          Validators.required,
        ],
      ],
    });
    // open modal
    uikit.modal('#seller-modal-full').show();
  }

}
