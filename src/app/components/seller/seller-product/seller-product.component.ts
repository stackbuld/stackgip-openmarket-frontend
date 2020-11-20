import { Component, OnInit } from "@angular/core";
import { ProductModel, CreateProductResponse } from  "../../../models/products.model";
import { ProductsService }  from "../../../services/products/products.service";

@Component({
  selector: "app-seller-product",
  templateUrl: "./seller-product.component.html",
  styleUrls: ["./seller-product.component.css"],
})
export class SellerProductComponent implements OnInit {

 createproduct: CreateProductResponse[];
 product: ProductModel;

  
  constructor( private productservice: ProductsService) {}
  ngOnInit(): void {

  }

  deleteProductDetail(productDetail: ProductModel) {
    console.log('Delete me!')
  }

  // removeOption(id) {
  //   this.productOptions = this.productOptions.filter((a) => a.id !== id);
  // }

}
