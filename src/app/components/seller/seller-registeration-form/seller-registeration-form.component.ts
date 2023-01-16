import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
// import { FormBuilder, Validators } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  sellerRegFormGroup: FormGroup;
  applicant: FormGroup;
  idCardTypes = ["NIN", "Voter's Card", "International Passport", "Driver's Licence"];
  // componentForm = this.fb.group({
    // registerationStatus: ["registered"],
    // businessName: ["", [Validators.required]],
    // businessPhone: ["", [Validators.required]],
    // businessEmail: ["", [Validators.required, Validators.email]],
    // businessAddress: ["", [Validators.required]],
    // businessCountry: ["", [Validators.required]],
    // businessState: ["", [Validators.required]],
    // businessCity: ["", [Validators.required]],
    // businessLogoUrl: [
    //   "",
    //   [
        // Validators.required,
    //   ],
    // ],
    // businessRegistrationNumber: [""],
    // businessApplicantAddress: ["", [Validators.required]],
    // businessAddressLandmark: ["", [Validators.required]],
    // businessApplicantID: ["", [Validators.required]],
    // businessIDType: ["", [Validators.required]],
  // });
  regSeller$: Subscription;

  states = nigeriaSates.map((a) => a.name.toLowerCase());
  constructor(
    private fb: FormBuilder,
    private sellerS: SellerService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.sellerRegForm();
    this.setBusinessCategoryValidators();
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

    console.log("Formcontrol",this.sellerRegFormGroup);
  }

  sellerRegForm(): void {
    this.applicant = this.fb.group({
      idType: ['', Validators.required],
      idNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    })
    this.sellerRegFormGroup = this.fb.group({
  userId: ['', Validators.required],
  businessName: ['', Validators.required],
  businessDescription: ['', Validators.required],
  businessAddress: ['', Validators.required],
  businessLogo: [''],
  businessRegistrationNumber: ['', Validators.required],
  street: ['', Validators.required],
  lga: ['', Validators.required],
  isBusinessRegistered: [true, Validators.required],
  state: ['', Validators.required],
  landmark: ['', Validators.required],
  applicant: this.applicant
    })
  }

  ngAfterViewChecked(): void {
    if (this.sellerRegFormGroup.get("isBusinessRegistered").value == "true") {
      this.sellerRegFormGroup.get("businessRegistrationNumber").enable();
    }

    if (this.imageName) {
      this.sellerRegFormGroup.get("businessLogo").setValue(this.imageName);
    }
  }

  // get registerationStatus() {
  //   return this.componentForm.get("registerationStatus").value;
  // }

  get isBusinessRegistered() {
    return this.sellerRegFormGroup.get("isBusinessRegistered").value;
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

    if (this.sellerRegFormGroup.invalid) {
      this.toast.error("Please fill fields appropriately");
    } else if (!this.image) {
      this.toast.error("business logo is required");
    } else {
      const sellerData: ISeller = this.sellerRegFormGroup.value;
      sellerData.businessLogo = this.image;
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

  setBusinessCategoryValidators() {
    const businessRegNumberControl = this.sellerRegFormGroup.get(
      "businessRegistrationNumber"
    );
    // const businessApplicantAddressControl = this.componentForm.get(
    //   "businessApplicantAddress"
    // );
    // const businessAddressLandmarkControl = this.componentForm.get(
    //   "businessAddressLandmark"
    // );

    this.sellerRegFormGroup
      .get("isBusinessRegistered")
      .valueChanges.subscribe((isBusinessRegistered) => {
        if (isBusinessRegistered === "true") {
          businessRegNumberControl.setValidators([Validators.required]);
          // businessApplicantAddressControl.setValidators(null);
          // businessAddressLandmarkControl.setValidators(null);
        }

        if (isBusinessRegistered === "false") {
          businessRegNumberControl.setValidators(null);
          // businessApplicantAddressControl.setValidators([Validators.required]);
          // businessAddressLandmarkControl.setValidators([Validators.required]);
        }

        businessRegNumberControl.updateValueAndValidity();
        // businessApplicantAddressControl.updateValueAndValidity();
        // businessAddressLandmarkControl.updateValueAndValidity();
      });
  }
}
