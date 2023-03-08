import { ReferralUser } from '../../../models/referraluser.model';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WindowRefService } from '../../../shared/services/window.service';
import * as crypto from 'crypto-js';
declare var UIkit: any;
@Component({
  selector: 'app-join-waitlist',
  templateUrl: './join-waitlist.component.html',
  styleUrls: ['./join-waitlist.component.css'],
})
export class JoinWaitlistComponent implements OnInit {
  constructor(windowService: WindowRefService) {
    this.window = windowService.nativeWindow;
  }
  window: Window;
  isLoading: boolean = false;
  showForm = true;
  referralUser: ReferralUser;
  waitListForm = new FormGroup({
    fullName: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    phoneNumber: new FormControl('', { validators: [Validators.required] }),
    interest: new FormControl('', { validators: [Validators.required] }),
  });
  goBack() {
    this.window.history.back();
  }

  ngOnInit(): void {
    this.window.prefinery('recordFormImpression');
    this.referralUser = {} as ReferralUser;
  }

  async submit() {
    if (this.waitListForm.valid) {
      const data = {
        full_name: this.waitListForm.value.fullName,
        email: this.waitListForm.value.email,
        telephone: this.waitListForm.value.phoneNumber,
        interest: this.waitListForm.value.interest,
      };
      this.isLoading = true;
      this.getUser(data.email, (user) => {
        console.log('returned user', user);
        if (!user.data) {
          this.window.prefinery('addUser', data, (record) => {
            console.log('api result', record);
            this.isLoading = false;
            this.referralUser = record as ReferralUser;
            console.log(this.referralUser);
            this.showForm = false;
          });
        } else {
          this.isLoading = false;
          this.referralUser = user.data as ReferralUser;
          console.log(this.referralUser);
          this.showForm = false;
          console.log('user already exist , do something else');
        }
      });

      // this.prefineryAuth(data.email, () => {

      // });
    } else {
      const errors = this.waitListForm.errors;
      console.error('form error', errors);
      this.isLoading = false;
    }
  }

  prefineryAuth(email: string, func: Function) {
    const signature = this.computeHash(email);

    this.window.prefinery(
      'authenticateUser',
      {
        email: email,
        signature: signature,
      },
      () => {
        func();
      }
    );
  }

  hideForm() {
    this.showForm = false;
  }
  computeHash(data: string) {
    const signature = crypto
      .HmacSHA256(data, 'pd9NRpF3vaj5VJQogJsrg3pB')
      .toString();

    return signature;
  }

  getUser(email: string, func: Function) {
    const signature = this.computeHash(email);

    this.prefineryAuth(email, () => {
      console.log('getting user');
      this.window.prefinery(
        'getUser',
        {
          email: email,
          signature: signature,
        },
        (user) => {
          console.log('primnary user', user);
          func(user);
        }
      );
    });
  }

  copyLink(link): void {
    this.window.navigator.clipboard.writeText(link);
    this.initializeNotification();
  }
  initializeNotification() {
    UIkit.notification({
      message: 'Copied!',
      status: 'primary',
      pos: 'top-center',
      timeout: 700,
    });
  }
}

function Inject(DOCUMENT: any) {
  throw new Error('Function not implemented.');
}
