import {
  onAddToCart,
  onDecreamentCartItem,
  onUpdateCartItemUnit,
  onRemoveItemFromCart,
  onClearCartItem,
} from "./action/cart.actions";
import { ProductCartModel } from "./../models/products.model";
import { onIncreament, onDecreament, OnReset } from "./action/actions";
import { createReducer, Action } from "@ngrx/store";

import { IUser } from "../models/IUserModel";
import { onLogin, onLogout, onUpdateUser } from "./action/auth.action";

export interface AppState {
  count: number;
  user: IUser;
  cart: ProductCartModel[];
}
export const initialState: AppState = {
  count: 0,
  user: null,
  cart: [],
};

export const rootReducer = "counterReducer";
// tslint:disable-next-line: variable-name
let _counterReducer;

_counterReducer = createReducer(
  initialState,
  onIncreament,
  onDecreament,
  OnReset,
  onLogin,
  onLogout,
  onUpdateUser,
  onAddToCart,
  onRemoveItemFromCart,
  onDecreamentCartItem,
  onUpdateCartItemUnit,
  onClearCartItem
);

export function counterReducer(state: AppState, action: Action) {
  return _counterReducer(state, action);
}
