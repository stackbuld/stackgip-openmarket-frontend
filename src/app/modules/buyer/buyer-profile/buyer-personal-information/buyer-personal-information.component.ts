import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buyer-personal-information',
  templateUrl: './buyer-personal-information.component.html',
  styleUrls: ['./buyer-personal-information.component.scss'],
})
export class BuyerPersonalInformationComponent implements OnInit {
  personalInfoForm: FormGroup;
  defaultImgUrl: string = 'assets/image/default-profile-picture-3.png';
  profileImgUrl: string;
  constructor() {}
  ngOnInit(): void {
    this.personalInfoForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });

    this.profileImgUrl = this.defaultImgUrl;
  }

  onSubmit() {}
}
