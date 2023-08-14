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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Router } from '@angular/router';
import {AuthService} from '../../../services/auth.service';

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
  applicant: FormGroup;
  idCardTypes = ['NIN', 'BVN'];
  regSeller$: Subscription;
  user: any;

  states = nigeriaSates.map((a) => a.name.toLowerCase());
  constructor(
    private fb: FormBuilder,
    private sellerS: SellerService,
    private toast: ToastrService,
    private locationStrategy: LocationStrategy,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isLogin.subscribe(a=> {
      if(a){
        this.user = JSON.parse(localStorage.getItem('user')) as IUser;
      }
    })


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
      }
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
      }
    );
  }

  back = () => {
    this.locationStrategy.back();
  };

  sellerRegForm(): void {
    this.sellerRegFormGroup = this.fb.group({
      businessName: ['', Validators.required],
      businessDescription: ['', Validators.required],
      businessAddress: ['', Validators.required],
      businessState: ['', Validators.required],
      businessRegistrationNumber: ['', Validators.required],
      // businessType: [''],
      personalIDType: ['', Validators.required],
      personalIDNumber: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      landmark: [''],
      lga: [''],
      dateOfBirth: ['', Validators.required],
      isBusinessRegistered: [true, Validators.required],
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

  // get registerationStatus() {
  //   return this.componentForm.get("registerationStatus").value;
  // }

  get isBusinessRegistered() {
    return this.sellerRegFormGroup.get('isBusinessRegistered')?.value;
  }

  submit() {
    console.log(this.user)
    if(!this.user?.id){
      this.authService.showSharedLoginModal();
      return;
    }
    const payload = {
      userId: this.user.id,
      businessName: this.sellerRegFormGroup.get('businessName')?.value,
      businessDescription: this.sellerRegFormGroup.get('businessDescription')?.value,
      businessAddress: this.sellerRegFormGroup.get('businessAddress')?.value,
      state: this.sellerRegFormGroup.get('businessState')?.value,
      businessRegistrationNumber:
        this.isBusinessRegistered === true
          ? this.sellerRegFormGroup.get('businessRegistrationNumber')?.value
          : null,
      businessLogo: this.image,
      businessType: '',
      lga: this.sellerRegFormGroup.get('lga')?.value,
      landmark: this.sellerRegFormGroup.get('landmark')?.value,
      street: this.sellerRegFormGroup.get('businessAddress')?.value,
      isBusinessRegistered: this.sellerRegFormGroup.get('isBusinessRegistered')?.value,
      applicant: {
        idType: this.sellerRegFormGroup.get('personalIDType')?.value,
        idNumber: this.sellerRegFormGroup.get('personalIDNumber')?.value,
        dateOfBirth: new Date(
          this.sellerRegFormGroup.get('dateOfBirth')?.value
        ).toISOString(),
        ...(this.sellerRegFormGroup.get('personalIDType')?.value === "NIN" && ({idUrl: this.imageID}))
      },
    };

    if (!this.image) {
      this.toast.error('business logo is required');
      return;
    } else if (this.sellerRegFormGroup.get('personalIDType')?.value === "NIN" && !this.imageID) {
      this.toast.error('NIN slip image is required');
      return;
    }else {
      this.isLoading = true;

      this.regSeller$ = this.sellerS.registerSeller(payload).subscribe(
        (res: { user: IUser; response: ResponseModel }) => {
          if (res.response.status === 'success') {
            this.isLoading = false;
            this.toast.success('Registeration successfully submited');
            // this.closeModal(true);
            uikit.modal("#confirm-seller-register").show();
            this.router.navigate(['/seller/dashboard']);
          }
        },
        (err) => {
          this.isLoading = false;
          this.toast.error(err.error.message);
        }
      );
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

  ngOnDestroy(): void {
    if (this.regSeller$) {
      this.regSeller$.unsubscribe();
    }
  }

  setBusinessCategoryValidators() {
    const businessRegNumberControl = this.sellerRegFormGroup.get(
      'businessRegistrationNumber'
    );
    // const businessApplicantAddressControl = this.componentForm.get(
    //   "businessApplicantAddress"
    // );
    // const businessAddressLandmarkControl = this.componentForm.get(
    //   "businessAddressLandmark"
    // );

    this.sellerRegFormGroup
      .get('isBusinessRegistered')?.valueChanges.subscribe((isBusinessRegistered) => {
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
}
