import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-kyc-nin-snack-bar-alert',
  template: `<div class="alert-container">
    <div [class.closed]="ninOpen" class="nin-alert" *ngIf="!isNinVerified">
      <div (click)="closeNin()" class="icon">
        <mat-icon class="">close</mat-icon>
      </div>
      <span class=""
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

    <div [class.closed]="kycOpen" class="kyc-alert" *ngIf="!isKycVerified">
      <div (click)="closeKyc()" class="close-icon">
        <mat-icon class="">close</mat-icon>
      </div>

      <span class="">Complete KYC to withdraw </span>
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
export class NinAndKYCVerificationAlert implements OnInit {
  @Input() isKycVerified: boolean = false;
  @Input() public isNinVerified: boolean = false;
  public router = inject(Router);

  public ninOpen: boolean = false;
  public kycOpen: boolean = false;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.alert$.subscribe({
      next: (res) => {
        console.log(res);
        this.ninOpen = res;
        this.kycOpen = res;
      },
    });
  }

  closeKyc(): void {
    this.kycOpen = !this.kycOpen;
  }
  closeNin(): void {
    this.ninOpen = !this.ninOpen;
  }
}
