import {ReferralUser} from '../../../models/referraluser.model';
import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {WindowRefService} from '../../../shared/services/window.service';
import * as crypto from 'crypto-js';
import {Router} from "@angular/router";

declare var UIkit: any;

@Component({
  selector: 'app-join-waitlist',
  templateUrl: './join-waitlist.component.html',
  styleUrls: ['./join-waitlist.component.css'],
})
export class JoinWaitlistComponent implements OnInit {
  window: Window;
  isLoading: boolean = false;
  showForm = true;
  referralUser: ReferralUser;
  waitListForm = new FormGroup({
    fullName: new FormControl('', {validators: [Validators.required]}),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    phoneNumber: new FormControl('', {validators: [Validators.required]}),
    interest: new FormControl('', {validators: [Validators.required]}),
  });

  constructor(windowService: WindowRefService, private router: Router) {
    this.window = windowService.nativeWindow;

  }

  goBack() {
    this.window?.history?.back();
  }

  ngOnInit(): void {
    this.window?.prefinery('recordFormImpression');
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
        if (!user.data) {
          this.window?.prefinery('addUser', data, (record) => {
            this.isLoading = false;
            this.referralUser = record as ReferralUser;
            this.showForm = false;
          });
        } else {
          this.router.navigate(['/', 'homepage'])
          this.isLoading = false;
          this.referralUser = user.data as ReferralUser;
          this.showForm = false;
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

    this.window?.prefinery(
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
      this.window?.prefinery(
        'getUser',
        {
          email: email,
          signature: signature,
        },
        (user) => {
          func(user);
        }
      );
    });
  }

  copyLink(link): void {
    this.window?.navigator?.clipboard?.writeText(link);
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
