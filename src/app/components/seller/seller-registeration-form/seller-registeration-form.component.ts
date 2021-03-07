import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import uikit from "uikit";
import { nigeriaSates } from "src/app/data/nigeriastates";
import { SellerService } from 'src/app/services/seller/seller.service';
import { Subscription } from 'rxjs';
import { ResponseModel } from 'src/app/shared/models/ResponseModel';
import { SellerModel } from 'src/app/models/sellerModel';

@Component({
  selector: 'app-seller-registeration-form',
  templateUrl: './seller-registeration-form.component.html',
  styleUrls: ['./seller-registeration-form.component.css']
})
export class SellerRegisterationFormComponent implements OnInit, OnDestroy {
  @Input() openModal: boolean = false;

  @Output() modalStatus = new EventEmitter(null);
  isLoading = false;
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
    // open modal
      uikit.modal('#seller-modal-full').show();
  }
  submit() {
    const sellerData: SellerModel = this.componentForm.value;
    this.isLoading = true;
    this.regSeller$ = this.sellerS.registerSeller(sellerData).subscribe(
      (res: ResponseModel) => {
        if (res.status === 'success') {
          this.isLoading = false;
          this.modalStatus.emit({
            isModalClose: true,
          });
        }
      },
      err => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }
  closeModal() {
    this.modalStatus.emit({
      isModalClose: true,
    });
    uikit.modal('#seller-modal-full').hide();
  }
  ngOnDestroy(): void {
    if (this.regSeller$) {
      this.regSeller$.unsubscribe();
    }
  }

}
