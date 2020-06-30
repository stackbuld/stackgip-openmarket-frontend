import { Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { ProductCartModel } from "src/app/models/products.model";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { getCart } from "src/app/reducers/selectors/cart.selector";
@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  constructor(private store: Store<AppState>) {}
  carts$: Observable<ProductCartModel[]>;
  cartTotal: number;
  ngOnInit(): void {
    this.carts$ = this.store.select(getCart);
    this.carts$.subscribe((items) => {
      let total = 0;
      for (const item of items) {
        total += item.price * item.unit;
      }
      this.cartTotal = total;
    });
  }

  calculateCartTotal() {}
}
