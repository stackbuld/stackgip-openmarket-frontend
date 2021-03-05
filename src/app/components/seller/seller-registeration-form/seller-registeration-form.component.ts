import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import uikit from "uikit";
import { nigeriaSates } from "src/app/data/nigeriastates";
import { SellerService } from 'src/app/services/seller/seller.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seller-registeration-form',
  templateUrl: './seller-registeration-form.component.html',
  styleUrls: ['./seller-registeration-form.component.css']
})
export class SellerRegisterationFormComponent implements OnInit, OnDestroy {
  @Input() openModal: boolean = false;

  @Output() modalStatus = new EventEmitter(null);
  componentForm = this.fb.group({
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
  regSeller$: Subscription;
  states = nigeriaSates.map((a) => a.name.toLowerCase());
  constructor(private fb: FormBuilder, private sellerS: SellerService) { }

  ngOnInit(): void {
    console.log(this.imgUrl);
    // open modal
    if (this.openModal) {
      uikit.modal('#seller-modal-full').show();
    }
  }
  submit() {
    console.log(this.componentForm.value);
    this.regSeller$ = this.sellerS.registerSeller(this.componentForm.value).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }
  get imgUrl() {
    return 'assets/svg/shopping-bag-icon.svg';
  }
  closeModal() {
    this.modalStatus.emit(true);
    uikit.modal('#seller-modal-full').hide();
  }
  ngOnDestroy(): void {
    if (this.regSeller$) {
      this.regSeller$.unsubscribe();
    }
  }

}
