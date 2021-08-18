import { AppState } from "./../index";
import { IUser } from "./../../models/IUserModel";
import { createAction, props, on } from "@ngrx/store";
import { produce } from "immer";

export const increment = createAction("[Counter Component] Increment");
export const decrement = createAction("[Counter Component] Decrement");
export const reset = createAction("[Counter Component] Reset");


export const onIncreament = on(increment, (state: AppState) => {
  const multiply = 3;
  const nextState = produce(state, (draftState) => {
    draftState.count += multiply;
  });
  return nextState;
});

export const onDecreament = on(decrement, (state: AppState) => ({
  ...state,
  count: state.count - 1,
}));

export const OnReset = on(reset, (state: AppState) => ({ ...state, count: 0 }));


