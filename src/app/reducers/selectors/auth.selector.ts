import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "..";
import { selectState } from "./selector";

const selectUser = (state: AppState) => state.user;
export const getUser = createSelector(selectState, selectUser);
