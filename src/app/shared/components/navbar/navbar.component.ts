import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from './../../../services/toastr.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user: any;
  currentSelection = '';
  seoDomain = environment.seoDomain;

  constructor(
    private router: Router,
    private toastService: ToastrService,
    private authService: AuthService
  ) {}

  public onClick(elementId: string): void {
    this.currentSelection = elementId;
    var myElement = document.getElementById(elementId);
    var topPos = myElement.offsetTop;
    document.getElementById('start-here').scrollTop = topPos;
  }

  ngOnInit(): void {
    // this.user = this.authService.getLoggedInUser());
    this.user = this.authService.getLoggedInUser();
  }

  sell = () => {
    if (this.user === null) {
      this.router.navigate(['/auth']);
    } else {
      if (this.user.isSellerApproved === true) {
        this.router.navigate(['/seller/dashboard']);
      } else {
        if (
          this.user.sellerApprovalStatus === null ||
          this.user.sellerApprovalStatus === '' ||
          this.user.sellerApprovalStatus.toLowerCase() === 'none'
        ) {
          this.router.navigate(['/seller-form']);
        }
        if (
          this.user.sellerApprovalStatus.toLowerCase() === 'pending' ||
          this.user.sellerApprovalStatus.toLowerCase() === 'failed'
        ) {
          if (this.user.sellerApprovalStatus.toLowerCase() === 'pending') {
            this.toastService.warining(
              'Your registration is pending approval, check back later!'
            );
          }
          if (this.user.sellerApprovalStatus.toLowerCase() === 'failed') {
            this.toastService.error('Your registration failed, contact admin!');
          }
        }
      }
    }
  };
}
