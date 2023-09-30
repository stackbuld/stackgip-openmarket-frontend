import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IUser } from 'src/app/models/IUserModel';
import { AuthService } from 'src/app/services/auth.service';
import { SellerService } from 'src/app/services/seller/seller.service';

@Component({
  selector: 'app-sidebar-header-display',
  templateUrl: './sidebar-header-display.component.html',
  styleUrls: ['./sidebar-header-display.component.css'],
})
export class SidebarHeaderDisplayComponent implements OnInit {
  currentRoute: string = 'seller/dashboard';
  userId: string;
  userProfilePicture: string;
  constructor(
    private router: Router,
    private authService: AuthService,
    private sellerService: SellerService
  ) {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? (this.currentRoute = event.url) : null;
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUser().id;
    this.userProfilePicture =
      localStorage.getItem('profilePicUrl') ||
      'assets/image/default-profile-picture-3.png';
    this.sellerService.getSeller(this.userId).subscribe({
      next: (data) => {
        this.userProfilePicture = data.data.profileImageUrl;
        localStorage.setItem('profilePicUrl', this.userProfilePicture);
      },
    });
  }
}
