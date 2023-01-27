import { Component, OnInit } from "@angular/core";
import { ProductModel, ProductsApiModel } from "src/app/models/products.model";
import { ProductsService } from "src/app/services/products/products.service";

import { ICategory } from "src/app/models/CategoryModels";
import { SellerService } from "src/app/services/seller/seller.service";
import { ISeller } from "src/app/models/sellerModel";
import { getLoggedInUser } from "src/app/helpers/userUtility";
import { CatgoryService } from "src/app/services/category/catgory.service";
import { IUser } from "src/app/models/IUserModel";
import { ActivatedRoute, Router } from "@angular/router";
declare var UIkit: any;

@Component({
  selector: "app-seller-show-case-product",
  templateUrl: "./seller-show-case-product.component.html",
  styleUrls: ["./seller-show-case-product.component.css"],
})
export class SellerShowCaseProductComponent implements OnInit {
  categories: ICategory[] = [];
  sellerId: string;
  sellerinfo: ISeller;
  sellerUrl: string;
  user: IUser;
  categoryId: string;
  products: ProductModel[] = [];
  pageNumber: number;
  maximumItem: number = 20;
  hasNextPage: boolean;
  totalItemCount: number;

  constructor(
    private productService: ProductsService,
    private sellerService: SellerService,
    private categoryService: CatgoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      this.categoryId = params.categoryId;
      this.fetchSellerProducts(this.sellerId, this.pageNumber);
    });
  }

  ngOnInit(): void {
    this.sellerId = this.route.snapshot.paramMap.get("sellerId");
    this.sellerUrl = window.location.href;

    let categoryId = this.route.snapshot.queryParamMap.get("categoryId");
    this.categoryId = categoryId ? categoryId : "";

    this.categoryService.getCategoryByUserId(this.sellerId).subscribe((a) => {

      this.categories = a.data;
    });

    this.fetchSellerProducts(this.sellerId, 1);

    this.sellerService.getSellerById(this.sellerId).subscribe((a) => {
      this.sellerinfo = a.data;
    });
  }
  fetchSellerProducts(userId: string, pageNumber: number) {
    this.productService
      .getSellerProducts(
        userId,
        pageNumber,
        this.maximumItem,
        "",
        this.categoryId
      )
      .subscribe((products: ProductsApiModel) => {
        this.products = products.data.data;
        this.pageNumber = products.data.pager.pageNumber;
        this.totalItemCount = products.data.pager.totalItemCount;
        this.hasNextPage = products.data.pager.hasNextPage;
      });
  }
  filterCategory(categoryId: string) {
    this.router.navigateByUrl(
      `/sellerproduct/${this.sellerId}?categoryId=${categoryId}`
    );
  }
  clearFilterCategory() {
    this.router.navigateByUrl(`/sellerproduct/${this.sellerId}`);
  }
  copySellerLink(): void {
    navigator.clipboard.writeText(this.sellerUrl);
    this.initializeNotification();
  }
  initializeNotification() {
    UIkit.notification({
      message: "Copied!",
      status: "primary",
      pos: "top-center",
      timeout: 700,
    });
  }
}
