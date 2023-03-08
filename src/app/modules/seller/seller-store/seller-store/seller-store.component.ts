import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { CreateProductResponse } from "../../../../models/products.model";
import { ProductsService } from "../../../../services/products/products.service";

@Component({
  selector: "app-seller-store",
  templateUrl: "./seller-store.component.html",
  styleUrls: ["./seller-store.component.css"],
})
export class SellerStoreComponent implements OnInit {
  @ViewChild('closeEdit') closeEdit: ElementRef<HTMLElement>;
  cproduct: CreateProductResponse[];

  constructor(private productservice: ProductsService) { }
  ngOnInit(): void { }


  cp(createproduct: CreateProductResponse): void {
    // this.productservice.createProduct(name).subscribe(cproduct => {
    //   this.cproduct.push(cproduct)
    // })
  }

  // closeAddProductModal(): void {
  //   this.closeCreate.nativeElement.click();
  // }

  closeEditProductModal(): void {
    this.closeEdit.nativeElement.click();
  }
}
