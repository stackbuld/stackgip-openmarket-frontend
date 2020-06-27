import { ProductModel } from "./../../../models/products.model";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-single-product",
  templateUrl: "./single-product.component.html",
  styleUrls: ["./single-product.component.css"],
})
export class SingleProductComponent implements OnInit {
  constructor() {}
  @Input() product: ProductModel;
  ngOnInit(): void {}
}
