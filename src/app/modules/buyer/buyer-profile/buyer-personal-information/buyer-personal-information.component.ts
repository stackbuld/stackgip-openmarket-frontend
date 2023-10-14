import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/IUserModel';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
declare var cloudinary: any;

@Component({
  selector: 'app-buyer-personal-information',
  templateUrl: './buyer-personal-information.component.html',
  styleUrls: ['./buyer-personal-information.component.scss'],
})
export class BuyerPersonalInformationComponent implements OnInit, OnDestroy {
  personalInfoForm: FormGroup;
  defaultImgUrl: string = 'assets/image/default-profile-picture-3.png';
  profileImgUrl: string;
  newImageUrl: string;
  userId: string;
  user!: IUser;
  isEditingSub$: Subscription;
  isEditing: boolean;
  uploadProfilePhotoWidget: any;
  specificUserData;
  isSubmitting: boolean = false;
  isFetching: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {
    this.personalInfoForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
    });

    this.profileImgUrl = this.defaultImgUrl;

    this.updateUser();

    this.isEditingSub$ = this.userService.isEditingUserInfo.subscribe({
      next: (status) => {
        this.isEditing = status;
        this.newImageUrl = this.profileImgUrl;
      },
    });

    this.uploadProfilePhotoWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          this.toast.success('Image uploaded successfully');

          this.newImageUrl = result.info.secure_url;
        }
      }
    );
  }

  updateUser() {
    this.isFetching = true;
    this.userId = this.authService.getLoggedInUser().id;

    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.isFetching = false;
        console.log(user);
        this.user = user.data;

        user.data.profileImageUrl
          ? (this.profileImgUrl = user.data.profileImageUrl)
          : (this.profileImgUrl = this.defaultImgUrl);

        this.personalInfoForm.setValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
        });

        this.specificUserData = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          profileImageUrl: this.user.profileImageUrl,
        };
      },
      error: (err) => {
        this.isFetching = false;

        console.log(err);
      },
    });
  }

  onRemoveProfilePhoto() {
    if (this.profileImgUrl == this.defaultImgUrl) {
      return;
    }
    this.newImageUrl = this.defaultImgUrl;
  }

  onChangeProfilePhoto() {
    this.uploadProfilePhotoWidget.open();
  }

  onEdit() {
    this.isEditing = true;
    this.userService.isEditingUserInfo.next(true);
  }

  onSubmit() {
    if (this.personalInfoForm.invalid) {
      return;
    }
    const profileImgUrl = this.newImageUrl
      ? this.newImageUrl
      : this.profileImgUrl;

    if (
      JSON.stringify(this.specificUserData) ==
      JSON.stringify({
        ...this.personalInfoForm.value,
        profileImageUrl: profileImgUrl,
      })
    ) {
      this.isEditing = false;
      this.userService.isEditingUserInfo.next(false);
      return;
    }
    this.isSubmitting = true;

    this.userService
      .updateUser({
        ...this.personalInfoForm.value,
        profileImageUrl: profileImgUrl,
      })
      .subscribe({
        next: (data) => {
          this.isSubmitting = false;
          this.isEditing = false;
          this.userService.isEditingUserInfo.next(false);
          this.userService.userProfileUpdated.next(true);
          this.toast.success('Profile updated successfully');

          this.updateUser();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error('Something went wrong! Try again later.');
        },
      });
  }

  ngOnDestroy(): void {
    this.userService.isEditingUserInfo.next(false);
    this.isEditingSub$.unsubscribe();
  }
}
