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
  mostSelling: {
    productId: string;
    name: string;
    imageUrl: string;
    unit: number;
    category: string;
    unitSold: number;
    revenue: number;
  }[] = [];
  user: any;
  userDetails: any;
  contents: {
    videoId: string;
    text: string;
    heading: string;
    action: string;
    routeUrl: string;
  }[] = [
    {
      videoId: 'kbc6HUkkiek',
      text: 'How to create a store',
      heading: 'Learn how to easily create a store!',
      action: 'Create a store',
      routeUrl: '/seller/store',
    },
    {
      videoId: 'ad4PkrfE39Y',
      text: 'How to add product',
      heading: 'Learn how to create a product!',
      action: 'Add product',
      routeUrl: '/seller/products/create',
    },
    {
      videoId: 'CJP6A13zpAI',
      text: 'How to confirm orders',
      heading: 'Learn how to easily confirm an order!',
      action: 'Confirm order',
      routeUrl: '/seller/orders',
    },
  ];

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService,
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
    this.dashboardService.getMostSellingProducts(this.user.id).subscribe({
      next: (res) => {
        this.mostSelling = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  getImageResolution = (url: string, width: number, height: number) => {
    return ImageResolutionUtility.getImageResolution(url, width, height);
  };
}
