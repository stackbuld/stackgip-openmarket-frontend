import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductModel } from "src/app/models/products.model";
import { ProductsService } from "src/app/services/products/products.service";

@Component({
  selector: "app-list-product",
  templateUrl: "./list-product.component.html",
  styleUrls: ["./list-product.component.css"],
})
export class ListProductComponent implements OnInit {
  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute
  ) {}
  products: ProductModel[] = [];

  ngOnInit(): void {
    let search = this.route.snapshot.queryParamMap.get("search");
    search = search ? search : "";
    let categoryId = this.route.snapshot.queryParamMap.get("categoryId");
    categoryId = categoryId ? categoryId : "";
    this.productService
      .getProducts(1, 20, search, categoryId)
      .subscribe((data) => {
        this.products = data.data.data;
      });
  }
}
