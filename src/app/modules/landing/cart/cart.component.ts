import {
  ClearCartItems,
  RemoveItemFromCart,
} from '../../../reducers/action/cart.actions';
import { Observable } from 'rxjs';
import { Component, OnInit, inject } from '@angular/core';
import { ProductCartModel } from '../../../models/products.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { getCart } from '../../../reducers/selectors/cart.selector';
import {environment} from '../../../../environments/environment';
import {DOCUMENT} from "@angular/common";
import {
  UpdateCartItemUnit,
  IncreamentCartItem,
  DecreamentCartItem,
} from '../../../reducers/action/cart.actions';
@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    standalone: false
})
export class CartComponent implements OnInit {
  constructor(private store: Store<AppState>) {}
  carts$: Observable<ProductCartModel[]>;
  cartTotal: number;
  seoDomain = environment.seoDomain;
  window = inject(DOCUMENT).defaultView;

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

  updateCartItem(id: string, unit: any) {
    this.store.dispatch(UpdateCartItemUnit({ id, orderedUnit: unit }));
  }

  incrementCartItem(id: string) {
    this.store.dispatch(IncreamentCartItem({ id }));
  }

  decrementCartItem(id: string) {
    this.store.dispatch(DecreamentCartItem({ id }));
  }
  clearAll() {
    this.store.dispatch(ClearCartItems());
  }
  removeItem(id) {
    this.store.dispatch(RemoveItemFromCart({ id }));
  }
}
