import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import uikit from "uikit";
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/IUserModel';
import { ISeller } from 'src/app/models/sellerModel';
import { environment } from "src/environments/environment";
import { nigeriaSates } from "src/app/data/nigeriastates";
import { SellerService } from 'src/app/services/seller/seller.service';
import { ResponseModel } from 'src/app/shared/models/ResponseModel';
import { ToastrService } from 'src/app/services/toastr.service';

declare var cloudinary: any;
@Component({
  selector: 'app-seller-registeration-form',
  templateUrl: './seller-registeration-form.component.html',
  styleUrls: ['./seller-registeration-form.component.css']
})
export class SellerRegisterationFormComponent implements OnInit, OnDestroy {
  @Input() openModal: boolean = false;

  @Output() modalStatus = new EventEmitter(null);
  image:string;
  isLoading = false;
  uploadWidget: any;
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
        // Validators.required,
      ],
    ],
  });
  regSeller$: Subscription;
  states = nigeriaSates.map((a) => a.name.toLowerCase());
  constructor(
    private fb: FormBuilder, private sellerS: SellerService, private toast: ToastrService
  ) { }

  ngOnInit(): void {
    // open modal
    uikit.modal('#seller-modal-full').show();
    this.uploadWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          this.image = result.info.secure_url
        }
      }
    )
  }

  submit() {
    if(!this.image){
      this.toast.error("business logo is required")
      return
    }
    const sellerData: ISeller = this.componentForm.value;
    sellerData.businessLogoUrl = this.image
    this.isLoading = true;
    this.regSeller$ = this.sellerS.registerSeller(sellerData).subscribe(
      (res: {user:IUser, response:ResponseModel}) => {
        if (res.response.status === 'success') {
          this.isLoading = false;
          this.toast.success("Registeration successfully submited")
          this.closeModal(true)
        }
      },
      err => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  closeModal(isFormSubmit=false) {
    this.modalStatus.emit({
      isModalClose: true, isFormSubmit
    });
    uikit.modal('#seller-modal-full').hide();
  }

  upload():void{
    this.uploadWidget.open();
  }

  ngOnDestroy(): void {
    if (this.regSeller$) {
      this.regSeller$.unsubscribe();
    }
  }
}
