import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { ImageResolutionUtility } from 'src/app/helpers/image-resolution.utility';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css'],
})
export class SellerDashboardComponent implements OnInit {
  loadingSummary: boolean;
  loading: boolean;
  dashboardData: any;
  mostSelling = [];
  user: any;
  userDetails: any;

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getDashboardData();
    this.getMostSelling();
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService.getUserById(this.user.id).subscribe({
      next: (res) => {
        this.userDetails = res.data;
      },
      error: (err) => {},
    });
  }

  getDashboardData() {
    this.loadingSummary = true;
    this.dashboardService.getSellerDashboardSummary(this.user.id).subscribe({
      next: (res) => {
        this.dashboardData = res.data;
        this.loadingSummary = false;
      },
      error: (err) => {
        this.loadingSummary = false;
      },
    });
  }

  getMostSelling() {
    this.loading = true;
    this.dashboardService.getMostSellingProducts(this.user.id).subscribe(
      (res) => {
        this.mostSelling = res.data;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  getImageResolution = (url: string, width: number, height: number) => {
    return ImageResolutionUtility.getImageResolution(url, width, height);
  };
}
