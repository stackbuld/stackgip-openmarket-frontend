import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { Component, OnInit } from '@angular/core';
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
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getDashboardData();
    this.getMostSelling();
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService.getUserById(this.user.id).subscribe(
      (res) => {
        this.userDetails = res.data;
      },
      (err) => {
        
      }
    );
  }

  getDashboardData() {
    this.loadingSummary = true;
    this.dashboardService.getSellerDashboardSummary(this.user.id).subscribe(
      (res) => {
        this.dashboardData = res.data;
        this.loadingSummary = false;
      },
      (err) => {
        this.loadingSummary = false;
      }
    );
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
}
