import { rootReducer } from "./../index";
import { createFeatureSelector } from "@ngrx/store";
import { AppState } from "..";

export const selectState = createFeatureSelector<AppState>(rootReducer);
