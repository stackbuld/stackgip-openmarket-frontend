import { Component, OnInit } from '@angular/core';
import { ProductModel } from "src/app/models/products.model";
import { ProductsService } from "src/app/services/products/products.service"

import { ICategory } from "src/app/models/CategoryModels";
import { SellerService } from 'src/app/services/seller/seller.service';
import { ISeller } from 'src/app/models/sellerModel';
import { getLoggedInUser } from 'src/app/helpers/userUtility';
import { CatgoryService } from 'src/app/services/category/catgory.service';
import { IUser } from 'src/app/models/IUserModel';

@Component({
  selector: 'app-seller-show-case-product',
  templateUrl: './seller-show-case-product.component.html',
  styleUrls: ['./seller-show-case-product.component.css']
})
export class SellerShowCaseProductComponent implements OnInit {
  categories: ICategory[] = [];
  sellerinfo: ISeller;
  user:IUser
 

  constructor(private productService: ProductsService, private sellerService: SellerService,private categoryService: CatgoryService) {}
  products: ProductModel[] = [];
  pageNumber: number;
  maximumItem: number = 20;
  hasNextPage:boolean;

  ngOnInit(): void {
  
      this.user = getLoggedInUser();
      this.categoryService.getCategoryByUserId(this.user.id).subscribe((a)=>{
        console.log(a.data);
        
        this.categories = a.data;
      })

    // this.productService.GetCategory().subscribe((a) => {
    //   this.categories = a.data;
    //   console.log(a.data); 
   // });
    this.fetchNextProducts(1);
   // const user = getLoggedInUser();
    this.sellerService.getSellerById(this.user.id).subscribe((a)=>{
      this.sellerinfo = a.data;
    });

  
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

