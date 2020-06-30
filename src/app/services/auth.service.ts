import { IResponseModel } from "./../shared/models/IResponseModel";

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { IUser } from "../models/IUserModel";
import { ApiAppUrlService } from "./api-app-url.service";
import {
  SignInModel,
  SiginResponseModel,
  ISignIn,
} from "../models/signin-model";
import { RegisterModel, RegisterResponseModel } from "../models/register-model";
import { IForgetModel, IForgetPasswordModel } from "../models/auth-model";
import { Store } from "@ngrx/store";
import { AppState } from "../reducers";
import { LoginAction, LogOutAction } from "../reducers/action/auth.action";

export interface IAuth {
  isLoggedId: boolean;
  token: string;
  userId: string;
  profileUrl: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public isLogin: BehaviorSubject<boolean>;
  constructor(
    private api: ApiAppUrlService,
    private http: HttpClient,
    private store: Store<AppState>
  ) {
    const userData = this.GetSignInData();
    console.log("user Data", userData);
    if (userData != null) {
      this.isLogin = new BehaviorSubject<boolean>(true);
    } else {
      this.isLogin = new BehaviorSubject<boolean>(false);
    }
  }

  public signIn(signInModel: SignInModel): Observable<SiginResponseModel> {
    return this.http.post<SiginResponseModel>(
      this.api.baseApiUrl + "Auth/Login",
      signInModel
    );
  }

  public register(
    registerModel: RegisterModel
  ): Observable<RegisterResponseModel> {
    return this.http.post<RegisterResponseModel>(
      this.api.baseApiUrl + "Auth/Register",
      registerModel
    );
  }

  public getCurrentUser(): Observable<IUser> {
    return this.http.get<IUser>(this.api.baseApiUrl + "Auth/current-user");
  }

  public GoogleSignIn(token): Observable<SiginResponseModel> {
    return this.http.post<SiginResponseModel>(
      this.api.baseApiUrl + "Auth/Google",
      { idToken: token }
    );
  }
  public FacebookSignIn(userId, token): Observable<SiginResponseModel> {
    return this.http.post<SiginResponseModel>(
      this.api.baseApiUrl + "Auth/Facebook",
      { token: token, userId: userId }
    );
  }
  public SendForgetPassword(forget: IForgetModel): Observable<IResponseModel> {
    return this.http.post<IResponseModel>(
      this.api.baseApiUrl + "Auth/Password/forgot",
      forget
    );
  }

  public ForgetPassword(
    forgetPassword: IForgetPasswordModel
  ): Observable<IResponseModel> {
    return this.http.patch<IResponseModel>(
      this.api.baseApiUrl + "auth/Password/reset",
      forgetPassword
    );
  }

  public SendConfirmationEmail(email: string): Observable<IResponseModel> {
    return this.http.get<IResponseModel>(
      this.api.baseApiUrl + "auth/verification/resend/?email=" + email
    );
  }

  public ConfirmEmail(
    email: string,
    token: string
  ): Observable<IResponseModel> {
    return this.http.get<IResponseModel>(
      this.api.baseApiUrl + `Auth/verification?userId=${email}&token=${token}`
    );
  }

  public SetAuthLocalStorage(a: SiginResponseModel) {
    localStorage.setItem("token", a.data.auth_token);
    localStorage.setItem("userId", a.data.user.id);
    localStorage.setItem("user", JSON.stringify(a.data.user));
    localStorage.setItem("role", JSON.stringify(a.data.roles));
    localStorage.setItem("siginResponse", JSON.stringify(a.data));
    this.store.dispatch(LoginAction(a.data.user));
  }

  public Logout() {
    localStorage.clear();
    this.store.dispatch(LogOutAction());
  }

  public GetSignInData(): ISignIn {
    const datastr = localStorage.getItem("siginResponse");
    const data = JSON.parse(datastr) as ISignIn;
    return data;
  }
}
