import { Component, OnInit } from "@angular/core";
import { ProductModel, CreateProductModel, CreateProductResponse } from  "../../../models/products.model";
import { ProductsService }  from "../../../services/products/products.service";

@Component({
  selector: "app-seller-product",
  templateUrl: "./seller-product.component.html",
  styleUrls: ["./seller-product.component.css"],
})
export class SellerProductComponent implements OnInit {

 cproduct: CreateProductResponse[];
//  product: ProductModel;
 pitems: ProductModel[];
  
  constructor( private productservice: ProductsService) {}
  ngOnInit(): void {
    this.productservice.getProducts(1, 4).subscribe(pitem => {
      this.pitems = pitem.data.data
    });
  }

 
  cp(createproduct: CreateProductResponse) {
    this.productservice.createProduct(name).subscribe(cproduct => {
      this.cproduct.push(cproduct)
    })
  }

  // removeOption(id) {
  //   this.productOptions = this.productOptions.filter((a) => a.id !== id);
  // }

}
