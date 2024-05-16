import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kyc-nin-snack-bar-alert',
  template: `<div class="alert-container">
    <div class="nin-alert" *ngIf="!isNinVerified">
      <div (click)="close.emit(false)" class="icon">
        <mat-icon class="">close</mat-icon>
      </div>
      <span class=" text-[14px] font-normal text-left"
        >Your National ID is required to complete this withdrawal
      </span>
      <br />
      <button
        mat-button
        class="button"
        (click)="router.navigate(['/seller/profile/personal-information'])"
      >
        Click here to upload
      </button>
    </div>

    <div class="kyc-alert" *ngIf="!isKycVerified">
      <div (click)="close.emit(false)" class="close-icon">
        <mat-icon class="">close</mat-icon>
      </div>

      <span class=" text-[14px] font-normal text-left"
        >Complete KYC to withdraw
      </span>
      <br />
      <button
        mat-button
        class="button"
        (click)="router.navigate(['/seller/profile/kyc-verification'])"
      >
        Click here to continue
      </button>
    </div>
  </div> `,
  styleUrls: ['./snackbar.scss'],
})
export class NinAndKYCVerificationALert {
  @Input() isKycVerified: boolean = false;
  @Input() public isNinVerified: boolean = false;
  @Output() close = new EventEmitter<boolean>();

  public router = inject(Router);
}
