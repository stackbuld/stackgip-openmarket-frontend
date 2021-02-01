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
  pageNumber: number;
  totalItemCount: number;
  maximumItem: number = 20;
  defaultPage:number = 1;
  search:string = "";
  categoryId:string = "";

  ngOnInit(): void {
    let search = this.route.snapshot.queryParamMap.get("search");
    this.search = search ? search : "";
    let categoryId = this.route.snapshot.queryParamMap.get("categoryId");
    this.categoryId = categoryId ? categoryId : "";
    this.fetchNextProducts(this.defaultPage)
  }

  fetchNextProducts(pageNumber:number){
    this.productService.getProducts(pageNumber, this.maximumItem, this.search, this.categoryId)
      .subscribe((products) => {
        this.products = products.data.data;
        this.pageNumber = products.data.pager.pageNumber;
        this.totalItemCount = products.data.pager.totalItemCount;
      },error => console.error(error));
  }
}
