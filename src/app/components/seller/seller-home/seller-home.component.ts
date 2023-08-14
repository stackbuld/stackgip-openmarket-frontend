import { Component, OnInit } from "@angular/core";
import { getLoggedInUser } from "src/app/helpers/userUtility";
import { OverView, OverviewApiModel } from "src/app/models/products.model";
import { MostSelling } from "../../../models/products.model";
import { ProductsService } from "../../../services/products/products.service";

@Component({
  selector: "app-seller-home",
  templateUrl: "./seller-home.component.html",
  styleUrls: ["./seller-home.component.css"],
})
export class SellerHomeComponent implements OnInit {
  overview: OverView;

  user = getLoggedInUser();

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    const users = this.user;
    this.productService.getProductOverview(users.id).subscribe((view) => {
      this.overview = view.data;
    });
  }
}
