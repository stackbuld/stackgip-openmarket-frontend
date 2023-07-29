import { UpdateProfileAction } from './../reducers/action/auth.action';
import { IUpdatePassword } from './../models/auth-model';
import {GetWssUrlResponse, IResponseModel} from './../shared/models/IResponseModel';

import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, BehaviorSubject, of, Subscription, firstValueFrom} from 'rxjs';
import { IUser } from '../models/IUserModel';
import { ApiAppUrlService } from './api-app-url.service';
import {
  SignInModel,
  SiginResponseModel,
  ISignIn,
} from '../models/signin-model';
import { RegisterModel, RegisterResponseModel } from '../models/register-model';
import { IForgetModel, IForgetPasswordModel } from '../models/auth-model';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { LoginAction, LogOutAction } from '../reducers/action/auth.action';
import { v4 as uuidv4 } from 'uuid';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from './jwt-helper.service';
import { ToastrService } from 'ngx-toastr';
import uikit from 'uikit';

export interface IAuth {
  isLoggedId: boolean;
  token: string;
  userId: string;
  profileUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLogin: BehaviorSubject<boolean>;
  tokenSubscription = new Subscription();
  decodedJwt;
  constructor(
    private api: ApiAppUrlService,
    private http: HttpClient,
    private store: Store<AppState>,
    private ngxService: NgxUiLoaderService,
    // private socialAuthService: SocialAuthService,
    private router: Router,
    private jwtHelperService: JwtHelperService,
    private toast: ToastrService,
  ) {
    const userData = this.GetSignInData();
    if (userData != null) {
      this.isLogin = new BehaviorSubject<boolean>(true);
    } else {
      this.isLogin = new BehaviorSubject<boolean>(false);
    }
  }

  // public signIn(signInModel: SignInModel): Observable<SiginResponseModel> {
  //   return this.http.post<SiginResponseModel>(
  //     this.api.baseApiUrl + "Auth/Login",
  //     signInModel
  //   );
  // }

  public signIn(signInModel: any): Observable<SiginResponseModel> {
    return this.http.post<SiginResponseModel>(
      this.api.baseApiUrl + 'Auth/Login',
      signInModel
    );
  }

  public register(
    registerModel: RegisterModel
  ): Observable<RegisterResponseModel> {
    return this.http.post<RegisterResponseModel>(
      this.api.baseApiUrl + 'auth/register',
      registerModel
    );
  }

  public GoogleSignIn(token): Observable<SiginResponseModel> {
    return this.http.post<SiginResponseModel>(
      this.api.baseApiUrl + 'Auth/Google',
      { idToken: token }
    );
  }
  public showSharedLoginModal (){
    uikit.modal('#login-modal').show();
  }

  public showSharedSocialModal (){
    uikit.modal('#social-modal').show();
  }

  public showSharedSignupModal (){
    uikit.modal('#signup-modal').show();
  }

  LoginWithGoogle(credentials: string): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(this.api.baseApiUrl + 'auth/google', {
      idToken: credentials,
    });
  }

  LoginWithFacebook(token: string, userId: string): Observable<any> {
    console.log(this.api.baseApiUrl, 'Path');
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(this.api.baseApiUrl + 'auth/facebook', {
      token,
      userId,
    });
  }

  getUserReferenceNumber(): string{
    let reference = '';
    if (localStorage.getItem('referenceId') === null) {
      reference =  uuidv4();
      localStorage.setItem('referenceId', reference)
    } else {
      reference = localStorage.getItem('referenceId') as string;
    }
    return reference;
  }

  signInWithGoogle(): void {
    this.ngxService.startLoader('loader-01');
    // this.socialAuthService.initState.subscribe(() => {
    //   this.socialAuthService
    //     .signIn(GoogleLoginProvider.PROVIDER_ID)
    //     .then((data) => {
    //       this.GoogleSignIn(data.idToken).subscribe((signInResponse) => {
    //         this.SetAuthLocalStorage(signInResponse);
    //         // this.logoutAndRedirectOnTokenExpiration(signInResponse.data.auth_token.token)
    //       });
    //       this.router.navigate([""]);
    //       this.ngxService.stopLoader("loader-01");
    //     });
    // });
  }

  public FacebookSignIn(userId, token): Observable<SiginResponseModel> {
    return this.http.post<SiginResponseModel>(
      this.api.baseApiUrl + 'Auth/Facebook',
      { token, userId }
    );
  }

  signInWithFacebook(): void {
    this.ngxService.startLoader('loader-01');
    // this.socialAuthService.initState.subscribe(() => {
    //   this.socialAuthService
    //     .signIn(FacebookLoginProvider.PROVIDER_ID)
    //     .then((data) => {
    //       this.FacebookSignIn(data.id, data.authToken).subscribe(
    //         (signInResponse) => {
    //           this.SetAuthLocalStorage(signInResponse);
    //         }
    //       );
    //       this.router.navigate([""]);
    //       this.ngxService.stopLoader("loader-01");
    //     });
    // });
  }

  expirationCounter(timeout): void {
    this.tokenSubscription.unsubscribe();
    this.tokenSubscription = of(null)
      .pipe(delay(timeout))
      .subscribe(() => {
        this.Logout();
        this.router.navigate(['./auth']);
      });
  }

  logoutAndRedirectOnTokenExpiration(token: string): void {
    this.decodedJwt = this.jwtHelperService.getDecodedAccessToken(token);
    this.expirationCounter((this.decodedJwt.exp - this.decodedJwt.iat) * 1000);
  }

  public SendForgetPassword(forget: IForgetModel): Observable<IResponseModel> {
    return this.http.post<IResponseModel>(
      this.api.baseApiUrl + 'Auth/Password/forgot',
      forget
    );
  }

  public ForgetPassword(
    forgetPassword: IForgetPasswordModel
  ): Observable<IResponseModel> {
    return this.http.patch<IResponseModel>(
      this.api.baseApiUrl + 'auth/Password/reset',
      forgetPassword
    );
  }

  public SendConfirmationEmail(email: string): Observable<IResponseModel> {
    return this.http.get<IResponseModel>(
      this.api.baseApiUrl + 'auth/verification/resend/?email=' + email
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
    localStorage.setItem('token', a.data.auth_token);
    localStorage.setItem('userId', a.data.user.id);
    localStorage.setItem('user', JSON.stringify(a.data.user));
    localStorage.setItem('role', JSON.stringify(a.data.roles));
    localStorage.setItem('siginResponse', JSON.stringify(a.data));
    // this.store.dispatch(LoginAction(a.data.user));
  }

  public Logout() {
    localStorage.clear();
    this.store.dispatch(LogOutAction());
  }

  public GetSignInData(): ISignIn {
    const datastr = localStorage.getItem('siginResponse');
    const data = JSON.parse(datastr) as ISignIn;

    return data;
  }

  public getLoggedInUser(): IUser {
    const user = localStorage.getItem('user');
    if (user) {
      const userJson: IUser = JSON.parse(user);
      return userJson;
    }
  }

  public UpdatePassword(
    updateUser: IUpdatePassword
  ): Observable<IResponseModel> {
    return this.http.patch<IResponseModel>(
      this.api.baseApiUrl + 'auth/password/change',
      updateUser
    );
  }

  public UpdateUser(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
    const sigin = this.GetSignInData();
    sigin.user = user;
    localStorage.setItem('siginResponse', JSON.stringify(sigin));
    this.store.dispatch(UpdateProfileAction(user));
  }

  public async  getWebSocketUrl(): Promise<string> {
    const referenceId = this.getUserReferenceNumber();
    const userId = this.getLoggedInUser()?.id?? '';
    // const cachedUrl = this.getLocalStorageItemWithExpiry('notificationWssUrl');
    const cachedUrl = '';

    if(!cachedUrl){
      const path = this.api.notificationBaseUrl+`negotiate?referenceId=${referenceId}&userId=${userId}`;
      const wssUrlResponse = await firstValueFrom(this.http.get<GetWssUrlResponse>(path));
      if(wssUrlResponse?.wssUrl){
        this.setLocalStorageItemWithExpiry('notificationWssUrl',wssUrlResponse?.wssUrl, 60*24 )
        return  wssUrlResponse?.wssUrl
      }
     throw new Error('unable to retrieve wss url');
    }else {
     return  cachedUrl;
    }
  }
  setLocalStorageItemWithExpiry(key, value: string, expiryInMinutes) {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + expiryInMinutes * 60 * 1000
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

// Function to get a localStorage item with expiration handling
  getLocalStorageItemWithExpiry<T>(key): string {
    const item = JSON.parse(localStorage.getItem(key));
    if (!item) return null;

    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  }


}
