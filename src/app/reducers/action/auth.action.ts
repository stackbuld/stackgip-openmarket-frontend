import { AppState } from "./../index";
import { IUser } from "./../../models/IUserModel";
import { createAction, props, on } from "@ngrx/store";
import { produce } from "immer";

export const LoginAction = createAction(
  "[Component Login] Login",
  props<IUser>()
);

export const UpdateProfileAction = createAction(
  "[Component Update Profile] Update Profile",
  props<IUser>()
);
export const LogOutAction = createAction("[Button Logout] Logout");

export const onLogin = on(LoginAction, (state: AppState, user: IUser) => {
  const nextState = produce(state, (draftState) => {
    draftState.user = user;
  });
  return nextState;
});

export const onLogout = on(LogOutAction, (state: AppState) => {
  const nextState = produce(state, (draft) => {
    draft.user = null;
  });
  return nextState;
});

export const onUpdateUser = on(
  UpdateProfileAction,
  (state: AppState, user: IUser) => {
    const nextState = produce(state, (draftState) => {
      draftState.user = user;
    });
    return nextState;
  }
);
