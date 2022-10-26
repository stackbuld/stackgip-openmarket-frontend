import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import uikit from "uikit";
import { Subscription } from "rxjs";
import { IUser } from "src/app/models/IUserModel";
import { ISeller } from "src/app/models/sellerModel";
import { environment } from "src/environments/environment";
import { nigeriaSates } from "src/app/data/nigeriastates";
import { SellerService } from "src/app/services/seller/seller.service";
import { ResponseModel } from "src/app/shared/models/ResponseModel";
import { ToastrService } from "src/app/services/toastr.service";

declare var cloudinary: any;
@Component({
  selector: "app-seller-registeration-form",
  templateUrl: "./seller-registeration-form.component.html",
  styleUrls: ["./seller-registeration-form.component.css"],
})
export class SellerRegisterationFormComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  @Input() openModal: boolean = false;

  @Output() modalStatus = new EventEmitter(null);
  image: string;
  imageName: string;
  isLoading = false;
  uploadWidget: any;
  componentForm = this.fb.group({
    registerationStatus: ["registered"],
    businessName: ["", [Validators.required]],
    businessPhone: ["", [Validators.required]],
    businessEmail: ["", [Validators.required]],
    businessAddress: ["", [Validators.required]],
    businessCountry: ["", [Validators.required]],
    businessState: ["", [Validators.required]],
    businessCity: ["", [Validators.required]],
    businessLogoUrl: [
      "",
      [
        // Validators.required,
      ],
    ],
    businessRegistrationNumber: ["", [Validators.required]],
    businessApplicantAddress: ["", [Validators.required]],
    businessAddressLandmark: ["", [Validators.required]],
    businessApplicantID: ["", [Validators.required]],
    businessIDType: ["", [Validators.required]],
  });
  regSeller$: Subscription;

  states = nigeriaSates.map((a) => a.name.toLowerCase());
  constructor(
    private fb: FormBuilder,
    private sellerS: SellerService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    // open modal
    uikit.modal("#seller-modal-full").show();
    this.uploadWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ["jpeg", "jpg", "png", "gif"],
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          this.image = result.info.secure_url;
          this.imageName = result.info.original_filename;
          console.log(this.imageName);
        }
      }
    );

    console.log(this.componentForm);
  }

  ngAfterViewChecked(): void {
    if (this.componentForm.get("registerationStatus").value == "registered") {
      this.componentForm.get("businessApplicantAddress").disable();
      this.componentForm.get("businessAddressLandmark").disable();
    } else {
      this.componentForm.get("businessApplicantAddress").enable();
      this.componentForm.get("businessAddressLandmark").enable();
    }

    if (this.imageName) {
      this.componentForm.get("businessLogoUrl").setValue(this.imageName);
    }
  }

  get registerationStatus() {
    return this.componentForm.get("registerationStatus").value;
  }

  submit() {
    // if (!this.image) {
    //   this.toast.error("business logo is required");
    //   return;
    // }

    // const sellerData: ISeller = this.componentForm.value;
    // sellerData.businessLogoUrl = this.image;
    // this.isLoading = true;
    // this.regSeller$ = this.sellerS.registerSeller(sellerData).subscribe(
    //   (res: { user: IUser; response: ResponseModel }) => {
    //     if (res.response.status === "success") {
    //       this.isLoading = false;
    //       this.toast.success("Registeration successfully submited");
    //       this.closeModal(true);
    //     }
    //   },
    //   (err) => {
    //     this.isLoading = false;
    //     console.log(err);
    //   }
    // );

    if (this.componentForm.invalid) {
      this.toast.error("Please fill fields appropriately");
    } else if (!this.image) {
      this.toast.error("business logo is required");
    } else {
      const sellerData: ISeller = this.componentForm.value;
      sellerData.businessLogoUrl = this.image;
      this.isLoading = true;
      this.regSeller$ = this.sellerS.registerSeller(sellerData).subscribe(
        (res: { user: IUser; response: ResponseModel }) => {
          if (res.response.status === "success") {
            this.isLoading = false;
            this.toast.success("Registeration successfully submited");
            this.closeModal(true);
          }
        },
        (err) => {
          this.isLoading = false;
          console.log(err);
        }
      );
    }
  }

  closeModal(isFormSubmit = false) {
    this.modalStatus.emit({
      isModalClose: true,
      isFormSubmit,
    });
    uikit.modal("#seller-modal-full").hide();
  }

  upload(): void {
    this.uploadWidget.open();
  }

  ngOnDestroy(): void {
    if (this.regSeller$) {
      this.regSeller$.unsubscribe();
    }
  }
}
