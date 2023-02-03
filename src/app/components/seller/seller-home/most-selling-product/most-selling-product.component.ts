import { Component, OnInit } from '@angular/core';
import { MostSelling } from '../../../../models/products.model';
import { ProductsService } from '../../../../services/products/products.service';

import { IUser } from '../../../../models/IUserModel';
import { numberWithCommas } from './../../../../helpers/number-format';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-most-selling-product',
  templateUrl: './most-selling-product.component.html',
  styleUrls: ['./most-selling-product.component.css'],
})
export class MostSellingProductComponent implements OnInit {
  numberWithCommas: Function = numberWithCommas;
  productDetails: MostSelling[];
  user = {} as IUser;

  constructor(
    private productService: ProductsService,
    private authService: AuthService
  ) {
    this.user = this.authService.getLoggedInUser();
  }

  ngOnInit(): void {
    const users = this.user;
    this.productService.getMostSelling(users.id).subscribe((productDetail) => {
      this.productDetails = productDetail.data;
    });
  }
}
