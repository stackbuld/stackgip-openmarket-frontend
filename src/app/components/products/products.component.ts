import { ProductModel } from "./../../models/products.model";
import { ProductsService } from "../../services/products/products.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  constructor(private productService: ProductsService) {}
  products: ProductModel[] = [];
  pageNumber: number;
  maximumItem: number = 20;
  hasNextPage:boolean;

  ngOnInit(): void {
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
