import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "..";
import { selectState } from "./selector";

const selectCart = (state: AppState) => state.cart;
const selectCartCount = (state: AppState) => state.cart.length;

export const getCart = createSelector(selectState, selectCart);
export const getCartCount = createSelector(selectState, selectCartCount);
