import { ProductsService } from "src/app/services/products/products.service";
import { Component, OnInit, Input } from "@angular/core";
import {
  EditProductModel,
  ProductWithOptionAndShipmentModel,
} from "./../../models/products.model";
import { formatDate } from "./../../helpers/date-format";

@Component({
  selector: "app-add-to-cart",
  templateUrl: "./add-to-cart.component.html",
  styleUrls: ["./add-to-cart.component.css"],
})
export class AddToCartComponent implements OnInit {
  @Input() product: ProductWithOptionAndShipmentModel;
  formatDate: Function;

  constructor(private productService: ProductsService) {
    this.formatDate = formatDate;
  }

  ngOnInit(): void {
    this.productService
      .getProductById(this.product.id.toString())
      .subscribe((a) => {
        this.product = (a.data as unknown) as ProductWithOptionAndShipmentModel;
      });
    // console.log(this.product)
  }
}
