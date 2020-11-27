import { Component, OnInit, ElementRef, ViewChild} from "@angular/core";
import { ProductModel, CreateProductModel, CreateProductResponse } from  "../../../models/products.model";
import { ProductsService }  from "../../../services/products/products.service";

@Component({
  selector: "app-seller-product",
  templateUrl: "./seller-product.component.html",
  styleUrls: ["./seller-product.component.css"],
})
export class SellerProductComponent implements OnInit {
  @ViewChild('productList') productList: ElementRef<HTMLElement>;
  @ViewChild('closeCreate') closeCreate: ElementRef<HTMLElement>;
  cproduct: CreateProductResponse[];
//  product: ProductModel;
 pitems: ProductModel[];
  
  constructor( private productservice: ProductsService) {}
  ngOnInit(): void {

  }

 
  cp(createproduct: CreateProductResponse) {
    this.productservice.createProduct(name).subscribe(cproduct => {
      this.cproduct.push(cproduct)
    })
  }

  closeAddProductModal(){
    this.closeCreate.nativeElement.click();
  }
  // removeOption(id) {
  //   this.productOptions = this.productOptions.filter((a) => a.id !== id);
  // }

}
