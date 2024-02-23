import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
// import { FormBuilder, Validators } from "@angular/forms";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import uikit from 'uikit';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/IUserModel';
import { ISeller } from 'src/app/models/sellerModel';
import { environment } from 'src/environments/environment';
import { nigeriaSates } from 'src/app/data/nigeriastates';
import { SellerService } from 'src/app/services/seller/seller.service';
import { ResponseModel } from 'src/app/shared/models/ResponseModel';
import { ToastrService } from 'src/app/services/toastr.service';
import { LocationStrategy } from '@angular/common';
import { countryCodes } from '../../../data/countryCodes';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

declare var cloudinary: any;

@Component({
  selector: 'app-seller-registeration-form',
  templateUrl: './seller-registeration-form.component.html',
  styleUrls: ['./seller-registeration-form.component.css'],
})
export class SellerRegisterationFormComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  @Input() openModal: boolean = false;
  @Output() modalStatus = new EventEmitter(null);

  image: string;
  imageName: string;
  imageID: string;
  imageNameID: string;
  isLoading = false;
  uploadWidget: any;
  uploadID: any;
  sellerRegFormGroup: FormGroup;
  idCardTypes = ['NIN'];
  regSeller$: Subscription;
  user: any;
  sellerApprovalStatus: string = '';
  rejectionReason: string = '';
  options: any = {
    types: ['address'],
    componentRestrictions: { country: 'NG' },
  };
  addressCity: string;
  googleAddressSelected: boolean = false;

  states = nigeriaSates.map((a) => a.name.toLowerCase());

  isTermsAndConditionsAgreed: FormControl = new FormControl(true);
  termsAndConditions: string = environment.termsAndConditionsUrl;
  uploadBusinessDocuments!: any;
  businessDocuments: { fileName: string; url: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private sellerS: SellerService,
    private toast: ToastrService,
    private locationStrategy: LocationStrategy,
    private router: Router,
    private authService: AuthService,
  ) {}

  get isBusinessRegistered() {
    return this.sellerRegFormGroup.get('isBusinessRegistered')?.value;
  }

  ngOnInit(): void {
    this.authService.isLogin.subscribe((a) => {
      if (a) {
        this.user = JSON.parse(localStorage.getItem('user')) as IUser;
      }
    });

    this.user = this.authService.getLoggedInUser();
    if (this.user) {
      this.initializeFormWithSellerDetails();
    }

    this.sellerRegForm();
    this.setBusinessCategoryValidators();

    this.uploadWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          this.toast.success('Image uploaded successfully');
          this.image = result.info.secure_url;
          this.imageName = result.info.original_filename;
        }
      },
    );

    this.uploadID = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          this.imageID = result.info.secure_url;
          this.imageNameID = result.info.original_filename;
        }
      },
    );

    this.uploadBusinessDocuments = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          const fileName = result.info.original_filename;
          const url = result.info.secure_url;
          const businessDocumentObject = { fileName: fileName, url: url };
          this.businessDocuments.push(businessDocumentObject);
        }
      },
    );

    this.sellerRegFormGroup
      .get('businessAddress')
      .valueChanges.subscribe((value) => {
        if (value === '') {
          this.googleAddressSelected = false;
        }
      });
  }

  ngAfterViewChecked(): void {
    if (this.sellerRegFormGroup.get('isBusinessRegistered')?.value == false) {
      this.sellerRegFormGroup.get('businessRegistrationNumber')?.disable();
    } else {
      this.sellerRegFormGroup.get('businessRegistrationNumber')?.enable();
    }

    // if (this.imageName) {
    //   this.sellerRegFormGroup.get("businessLogo").setValue(this.imageName);
    // }
  }

  back = () => {
    this.locationStrategy.back();
  };

  handleAddressChange(address: Address) {
    try {
      this.googleAddressSelected = true;
      let state = address.address_components.filter((element) => {
        return element.types.includes('administrative_area_level_1');
      });
      let lga = address.address_components.filter((element) => {
        return element.types.includes('administrative_area_level_2');
      });
      let locality = address.address_components.filter((element) => {
        return element.types.includes('locality');
      });

      this.sellerRegFormGroup.patchValue({
        businessAddress: address.formatted_address,
        businessState: state[0].long_name.toLowerCase(),
        lga: lga.length > 0 ? lga[0].long_name : locality[0].long_name,
      });
    } catch {}
  }

  initializeFormWithSellerDetails() {
    this.sellerS.getSellerById(this.user?.id).subscribe((res) => {
      if (res.status === 'success') {
        const sellerData: ISeller = res.data;
        this.sellerApprovalStatus = sellerData.sellerApprovalStatus;
        this.rejectionReason = sellerData.rejectionReason;
        if (this.sellerApprovalStatus === 'approved') {
          this.router.navigate(['/seller/dashboard']);
        }

        this.sellerRegFormGroup.patchValue(sellerData);
        this.sellerRegFormGroup.patchValue({
          lga: sellerData.userLga,
          personalIDNumber: sellerData.idVerificationNumber,
          personalIDType: sellerData.idVerificationType,
          landmark: sellerData.userAddressLandMark,
        });
        this.image = sellerData.businessLogo;
      }
    });
  }

  sellerRegForm(): void {
    this.sellerRegFormGroup = this.fb.group({
      businessName: [null, Validators.required],
      businessDescription: ['', Validators.required],
      businessAddress: [null, Validators.required],
      businessState: [null, Validators.required],
      businessRegistrationNumber: [null, Validators.required],
      personalIDType: [null, Validators.required],
      personalIDNumber: [
        null,
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      landmark: [null, Validators.required],
      lga: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      isBusinessRegistered: [true, Validators.required],
    });
  }

  // get registerationStatus() {
  //   return this.componentForm.get("registerationStatus").value;
  // }

  openModalForMe() {
    this.authService.showSharedSignupModal();
  }

  updateSellerLocalDetails() {
    const sellerId = this.authService.getLoggedInUser().id;
    this.sellerS.getSeller(sellerId).subscribe({
      next: (seller) => {
        localStorage.setItem('user', JSON.stringify(seller.data));
      },
      error: (err) => {},
    });
  }

  submit() {
    if (!this.user?.id) {
      this.authService.showSharedLoginModal();
      return;
    }
    if (!this.googleAddressSelected) {
      this.toast.warining('Select an address that shows as you type!');
      return;
    }

    if (this.isBusinessRegistered && this.businessDocuments.length == 0) {
      this.toast.error('Upload your business documents!');
      return;
    }

    const newBusinessDocuments = this.businessDocuments.map((document) => {
      return { documentUrl: document.url };
    });

    const payload = {
      userId: this.user.id,
      businessName: this.sellerRegFormGroup.get('businessName')?.value,
      businessDescription: this.sellerRegFormGroup.get('businessDescription')
        ?.value,
      businessAddress: this.sellerRegFormGroup.get('businessAddress')?.value,
      state: this.sellerRegFormGroup.get('businessState')?.value,
      businessRegistrationNumber:
        this.isBusinessRegistered === true
          ? this.sellerRegFormGroup.get('businessRegistrationNumber')?.value
          : null,
      businessType: '',
      lga: this.sellerRegFormGroup.get('lga')?.value,
      landmark: this.sellerRegFormGroup.get('landmark')?.value,
      street: this.sellerRegFormGroup.get('businessAddress')?.value,
      isBusinessRegistered: this.sellerRegFormGroup.get('isBusinessRegistered')
        ?.value,
      applicant: {
        idType: this.sellerRegFormGroup.get('personalIDType')?.value,
        idNumber: this.sellerRegFormGroup.get('personalIDNumber')?.value,
        dateOfBirth: new Date(
          this.sellerRegFormGroup.get('dateOfBirth')?.value,
        ).toISOString(),
        ...(this.sellerRegFormGroup.get('personalIDType')?.value === 'NIN' && {
          idUrl: this.imageID,
        }),
      },
      businessDocuments: [...newBusinessDocuments],
    };

    if (
      this.sellerRegFormGroup.get('personalIDType')?.value === 'NIN' &&
      !this.imageID
    ) {
      this.toast.error('NIN slip image is required');
      return;
    } else {
      this.isLoading = true;

      this.regSeller$ = this.sellerS.registerSeller(payload).subscribe({
        next: (res: { user: IUser; response: ResponseModel }) => {
          if (res.response.status === 'success') {
            this.isLoading = false;
            this.toast.success('Registration successfully submitted');
            this.updateSellerLocalDetails();
            // this.closeModal(true);
            uikit.modal('#confirm-seller-register').show();
            // this.router.navigate(['/seller/dashboard']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.toast.error(err.error.message);
        },
      });
    }

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
    //   }
    // );

    // if (this.sellerRegFormGroup.invalid) {
    //   this.toast.error("Please fill fields appropriately");
    // } else if (!this.image) {
    //   this.toast.error("business logo is required");
    // } else {
    //   const sellerData: ISeller = this.sellerRegFormGroup.value;
    //   sellerData.businessLogo = this.image;
    //   this.isLoading = true;

    //   this.regSeller$ = this.sellerS.registerSeller(sellerData).subscribe(
    //     (res: { user: IUser; response: ResponseModel }) => {
    //       if (res.response.status === "success") {
    //         this.isLoading = false;
    //         this.toast.success("Registeration successfully submited");
    //         this.closeModal(true);
    //       }
    //     },
    //     (err) => {
    //       this.isLoading = false;

    //     }
    //   );
    // }
  }

  closeModal(isFormSubmit = false) {
    this.modalStatus.emit({
      isModalClose: true,
      isFormSubmit,
    });
    uikit.modal('#seller-modal-full').hide();
  }

  upload(): void {
    this.uploadWidget.open();
  }

  uploadIDCard(): void {
    this.uploadID.open();
  }

  onUploadBusinessDocuments() {
    this.uploadBusinessDocuments.open();
  }

  onRemoveDocument(id: number) {
    this.businessDocuments = this.businessDocuments.filter(
      (doc, index) => index != id,
    );
  }

  setBusinessCategoryValidators() {
    const businessRegNumberControl = this.sellerRegFormGroup.get(
      'businessRegistrationNumber',
    );
    // const businessApplicantAddressControl = this.componentForm.get(
    //   "businessApplicantAddress"
    // );
    // const businessAddressLandmarkControl = this.componentForm.get(
    //   "businessAddressLandmark"
    // );

    this.sellerRegFormGroup
      .get('isBusinessRegistered')
      ?.valueChanges.subscribe((isBusinessRegistered) => {
        if (isBusinessRegistered === 'true') {
          businessRegNumberControl?.setValidators([Validators.required]);
          // businessApplicantAddressControl.setValidators(null);
          // businessAddressLandmarkControl.setValidators(null);
        }

        if (isBusinessRegistered === 'false') {
          businessRegNumberControl?.setValidators(null);
          // businessApplicantAddressControl.setValidators([Validators.required]);
          // businessAddressLandmarkControl.setValidators([Validators.required]);
        }

        businessRegNumberControl?.updateValueAndValidity();
        // businessApplicantAddressControl.updateValueAndValidity();
        // businessAddressLandmarkControl.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    if (this.regSeller$) {
      this.regSeller$.unsubscribe();
    }
  }
}
