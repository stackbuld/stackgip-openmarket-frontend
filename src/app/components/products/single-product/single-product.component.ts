import { ToastrService } from "src/app/services/toastr.service";
import {
  ProductModel,
  Category,
  ProductCartModel,
} from "./../../../models/products.model";
import { Component, OnInit, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { AddToCart } from "src/app/reducers/action/cart.actions";

@Component({
  selector: "app-single-product",
  templateUrl: "./single-product.component.html",
  styleUrls: ["./single-product.component.css"],
})
export class SingleProductComponent implements OnInit {
  constructor(private toast: ToastrService, private store: Store<AppState>) {}
  @Input() product;
  ngOnInit(): void {}

  addToCart(product: ProductModel) {
    const productCart: ProductCartModel = {
      category: product.category,
      categoryId: product.categoryId,
      unit: product.unit,
      createdOn: product.createdOn,
      name: product.name,
      description: product.description,
      id: product.id,
      imageUrl: product.imageUrl,
      orderedUnit: 1,
      previousPrice: product.previousPrice,
      price: product.price,
      productImages: product.productImages,
    };
    this.store.dispatch(AddToCart(productCart));
    this.toast.success("product added to cart");
  }
}
