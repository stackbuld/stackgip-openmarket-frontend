import { IUser } from './../../../models/IUserModel';
import { Component, OnInit } from '@angular/core';

import { OverView, OverviewApiModel } from 'src/app/models/products.model';
import { AuthService } from 'src/app/services/auth.service';
import { MostSelling } from '../../../models/products.model';
import { ProductsService } from '../../../services/products/products.service';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  overview: OverView;

  user = {} as IUser;

  constructor(
    private productService: ProductsService,
    private authService: AuthService
  ) {
    this.user = this.authService.getLoggedInUser();
  }

  ngOnInit(): void {
    const users = this.user;
    this.productService.getProductOverview(users.id).subscribe((view) => {
      this.overview = view.data;
    });
  }
}
