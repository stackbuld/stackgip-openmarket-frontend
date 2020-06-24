import { onIncreament, onDecreament, OnReset } from "./action/actions";
import { createReducer, Action } from "@ngrx/store";
import { environment } from "../../environments/environment";
import { state } from "@angular/animations";
import { IUser } from "../models/IUserModel";
import { onLogin, onLogout } from "./action/auth.action";

export interface AppState {
  count: number;
  user: IUser;
}
export const initialState: AppState = {
  count: 0,
  user: null,
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
  onLogout
);

export function counterReducer(state: AppState | undefined, action: Action) {
  return _counterReducer(state, action);
}
