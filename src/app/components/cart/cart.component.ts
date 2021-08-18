import {
  ClearCartItems,
  RemoveItemFromCart,
} from "./../../reducers/action/cart.actions";
import { Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { ProductCartModel } from "src/app/models/products.model";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { getCart } from "src/app/reducers/selectors/cart.selector";
import {
  UpdateCartItemUnit,
  IncreamentCartItem,
  DecreamentCartItem,
} from "src/app/reducers/action/cart.actions";
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
        total += item.price * item.orderedUnit;
      }
      this.cartTotal = total;
    });
  }

  updateCartItem(id: number, unit: number) {
    this.store.dispatch(UpdateCartItemUnit({ id, orderedUnit: unit }));
  }

  incrementCartItem(id: number) {
    this.store.dispatch(IncreamentCartItem({ id }));
  }

  decrementCartItem(id: number) {
    this.store.dispatch(DecreamentCartItem({ id }));
  }
  clearAll() {
    this.store.dispatch(ClearCartItems());
  }
  removeItem(id) {
    this.store.dispatch(RemoveItemFromCart({ id }));
  }
}
