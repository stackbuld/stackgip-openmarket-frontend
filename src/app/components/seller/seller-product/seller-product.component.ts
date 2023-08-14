import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { CreateProductResponse } from "../../../models/products.model";
import { ProductsService } from "../../../services/products/products.service";
import { ViewMoreComponent } from './view-more/view-more.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductItemComponent } from './product-item/product-item.component';

@Component({
  selector: "app-seller-product",
  templateUrl: "./seller-product.component.html",
  styleUrls: ["./seller-product.component.css"],
})
export class SellerProductComponent implements OnInit {
  @ViewChild('productList') productList: ProductItemComponent;
  @ViewChild('closeCreate') closeCreate: ElementRef<HTMLElement>;
  @ViewChild('editProduct') editProduct: EditProductComponent;
  @ViewChild('viewMore') viewMore: ViewMoreComponent;
  @ViewChild('closeEdit') closeEdit: ElementRef<HTMLElement>;
  cproduct: CreateProductResponse[];

  constructor(private productservice: ProductsService) { }
  ngOnInit(): void { }


  cp(createproduct: CreateProductResponse): void {
    // this.productservice.createProduct(name).subscribe(cproduct => {
    //   this.cproduct.push(cproduct)
    // })
  }

  closeAddProductModal(): void {
    this.closeCreate.nativeElement.click();
  }

  closeEditProductModal(): void {
    this.closeEdit.nativeElement.click();
  }
}
