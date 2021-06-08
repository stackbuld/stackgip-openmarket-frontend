import { Component, OnInit } from '@angular/core';
import { ProductModel } from "src/app/models/products.model";
import { ProductsService } from "src/app/services/products/products.service"

import { ICategory } from "src/app/models/CategoryModels";

@Component({
  selector: 'app-seller-show-case-product',
  templateUrl: './seller-show-case-product.component.html',
  styleUrls: ['./seller-show-case-product.component.css']
})
export class SellerShowCaseProductComponent implements OnInit {
  categories: ICategory[] = [];
 

  constructor(private productService: ProductsService) {}
  products: ProductModel[] = [];
  pageNumber: number;
  maximumItem: number = 20;
  hasNextPage:boolean;

  ngOnInit(): void {
    this.productService.GetCategory().subscribe((a) => {
      this.categories = a.data;
    });
    this.fetchNextProducts(1);

  
}
fetchNextProducts(pageNumber:number){
  this.productService.getProducts( pageNumber, this.maximumItem)
    .subscribe((product) => {
      this.products = [...this.products, ...product.data.data];
      this.pageNumber = product.data.pager.pageNumber;
      this.hasNextPage = product.data.pager.hasNextPage;
    },error => console.error(error));
}

}

