import { ProductCartModel } from "./../../models/products.model";

import { AppState } from "./../index";
import { IUser } from "./../../models/IUserModel";
import { createAction, props, on } from "@ngrx/store";
import { produce } from "immer";
export const AddToCart = createAction(
  "[Button AddToCart] Add item to cart",
  props<ProductCartModel>()
);

export const RemoveItemFromCart = createAction(
  "[Button RemoveFromCart] RemoveItemFromCart",
  props<{ id: number }>()
);
export const IncreamentCartItem = createAction(
  "[Button IncreamentCart] IncreamentCartItem",
  props<{ id: number }>()
);

export const DecreamentCartItem = createAction(
  "[Button DecreamentCart] DecreamentCartItem",
  props<{ id: number }>()
);
export const UpdateCartItemUnit = createAction(
  "[Textbox UpdateCartItemUnit] UpdateCartItemUnit",
  props<{ id: number; orderedUnit: number }>()
);

export const ClearCartItems = createAction(
  // tslint:disable-next-line: quotemark
  "[Button ClearCartItems] Clear all cart items"
);
//
export const onIncreamentCartItem = on(
  IncreamentCartItem,
  (state: AppState, item: { id: number }) => {
    const nextState = produce(state, (draftState) => {
      const itemExist = draftState.cart.find((a) => a.id === item.id);
      if (itemExist) {
        // Increament
        itemExist.orderedUnit += 1;
      }
    });
    return nextState;
  }
);
//

export const onClearCartItem = on(ClearCartItems, (state: AppState) => {
  const nextState = produce(state, (draftState) => {
    draftState.cart = [];
  });
  return nextState;
});

export const onDecreamentCartItem = on(
  DecreamentCartItem,
  (state: AppState, item: { id: number }) => {
    const nextState = produce(state, (draftState) => {
      const itemExist = draftState.cart.find((a) => a.id === item.id);
      if (itemExist) {
        // Increament
        const orderedUnit = draftState.cart[itemExist.id].orderedUnit;
        if (orderedUnit > 0) {
          draftState.cart[item.id].orderedUnit -= 1;
        }
      }
    });
    return nextState;
  }
);
//
export const onUpdateCartItemUnit = on(
  UpdateCartItemUnit,
  (state: AppState, item: { id: number; orderedUnit: number }) => {
    const nextState = produce(state, (draftState) => {
      const itemExist = draftState.cart.find((a) => a.id === item.id);
      if (itemExist && item.orderedUnit > 0) {
        itemExist.orderedUnit = Number(item.orderedUnit);
      }
    });
    return nextState;
  }
);

export const onRemoveItemFromCart = on(
  RemoveItemFromCart,
  (state: AppState, item: { id: number }) => {
    const nextState = produce(state, (draftState) => {
      draftState.cart = draftState.cart.filter((a) => a.id !== item.id);
    });
    return nextState;
  }
);
export const onAddToCart = on(
  AddToCart,
  (state: AppState, productCart: ProductCartModel) => {
    const nextState = produce(state, (draftState) => {
      const item = draftState.cart.find((a) => a.id === productCart.id);
      if (!item) {
        // add item to cart
        draftState.cart.push(productCart);
      } else {
        // increament cart
        item.orderedUnit = Number(item.orderedUnit) + 1;
      }
    });
    return nextState;
  }
);
