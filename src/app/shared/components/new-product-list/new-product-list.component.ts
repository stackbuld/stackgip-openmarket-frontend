import { ProductModel } from "../../../models/products.model";
import { ProductsService } from "../../../services/products/products.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-new-product-list",
  templateUrl: "./new-product-list.component.html",
  styleUrls: ["./new-product-list.component.css"],
})
export class NewProductListComponent implements OnInit {
  constructor(private productService: ProductsService) {}
  products: ProductModel[] = [];
  ngOnInit(): void {
    this.productService.getNewProducts().subscribe((a) => {
      this.products = a.data.data;
    });
  }
}
