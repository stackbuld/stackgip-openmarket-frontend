import { UpdateProfileAction } from './../reducers/action/auth.action';
import { IUpdatePassword } from './../models/auth-model';
import {
  GetWssUrlResponse,
  IResponseModel,
} from './../shared/models/IResponseModel';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  of,
  Subscription,
  firstValueFrom,
} from 'rxjs';
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
import { delay, filter, tap } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { JwtHelperService } from './jwt-helper.service';
import { ToastrService } from 'ngx-toastr';
import uikit from 'uikit';
import { AppLocalStorage } from '../helpers/local-storage';
import { H } from 'highlight.run';
import { datadogRum } from '@datadog/browser-rum';

declare var clarity: any;
export interface IAuth {
  isLoggedId: boolean;
  token: string;
  userId: string;
  profileUrl: string;
}

export interface OTPVerificationResponse {
  data: string[];
  message: any;
  status: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUrl: string = '';
  public isLogin: BehaviorSubject<boolean>;
  tokenSubscription = new Subscription();
  decodedJwt;

  constructor(
    private api: ApiAppUrlService,
    private http: HttpClient,
    private store: Store<AppState>,
    private ngxService: NgxUiLoaderService,
    private applocal: AppLocalStorage,
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
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => (this.currentUrl = event.url));
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
      signInModel,
    );
  }

  public register(
    registerModel: RegisterModel,
  ): Observable<RegisterResponseModel> {
    return this.http.post<RegisterResponseModel>(
      this.api.baseApiUrl + 'auth/register',
      registerModel,
    );
  }

  public GoogleSignIn(token): Observable<SiginResponseModel> {
    return this.http.post<SiginResponseModel>(
      this.api.baseApiUrl + 'Auth/Google',
      { idToken: token },
    );
  }

  public hideSharedLoginModal() {
    uikit.modal('#login-modal').hide();
  }

  public hideSharedSocialModal() {
    uikit.modal('#social-modal').hide();
  }

  public showSharedLoginModal() {
    this.hideSharedSignupModal();
    this.hideSharedSocialModal();
    uikit.modal('#login-modal').show();
  }

  public showSharedSocialModal() {
    this.hideSharedSignupModal();
    this.hideSharedLoginModal();
    uikit.modal('#social-modal').show();
  }

  public showSharedSignupModal() {
    this.hideSharedLoginModal();
    this.hideSharedSocialModal();
    uikit.modal('#signup-modal').show();
  }

  public hideSharedSignupModal() {
    uikit.modal('#signup-modal').hide();
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

  getUserReferenceNumber(): string {
    let reference = '';
    if (localStorage.getItem('referenceId') === null) {
      reference = uuidv4();
      localStorage.setItem('referenceId', reference);
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
      { token, userId },
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
      forget,
    );
  }

  public ForgetPassword(
    forgetPassword: IForgetPasswordModel,
  ): Observable<IResponseModel> {
    return this.http.patch<IResponseModel>(
      this.api.baseApiUrl + 'auth/Password/reset',
      forgetPassword,
    );
  }

  public SendConfirmationEmail(email: string): Observable<IResponseModel> {
    return this.http.get<IResponseModel>(
      this.api.baseApiUrl + 'auth/verification/resend/?email=' + email,
    );
  }

  public resendConfirmationEmail(email: string) {
    return this.http.get(
      this.api.baseApiUrl + 'auth/verification/resend?email=' + email,
    );
  }

  sendPasswordChangeOTP() {
    return this.http.get(this.api.baseApiUrl + 'auth/password/change/otp');
  }

  sendPinChangeOTP() {
    return this.http.get(this.api.baseApiUrl + 'auth/pin/change/otp');
  }

  updatePin(credentials: { newPin: string; phoneOtp: string }) {
    return this.http.patch<OTPVerificationResponse>(
      this.api.baseApiUrl + 'auth/pin/change',
      credentials,
    );
  }

  sendPersonalPhoneOTP() {
    return this.http.get(this.api.baseApiUrl + 'users/phonenumber/send-otp');
  }

  verifyPersonalPhoneNumber(credentials: { phoneNumber: string; otp: string }) {
    return this.http.put<OTPVerificationResponse>(
      this.api.baseApiUrl + 'users/phonenumber/verify',
      credentials,
    );
  }

  sendBusinessPhoneOTP() {
    return this.http.get(
      this.api.baseApiUrl + 'sellers/businessphone/send-otp',
    );
  }

  verifyBusinessPhoneNumber(credentials: {
    businessPhone: string;
    otp: string;
  }) {
    return this.http.put<OTPVerificationResponse>(
      this.api.baseApiUrl + 'sellers/businessphone/verify',
      credentials,
    );
  }

  public ConfirmEmail(
    email: string,
    token: string,
  ): Observable<IResponseModel> {
    return this.http.get<IResponseModel>(
      this.api.baseApiUrl + `Auth/verification?userId=${email}&token=${token}`,
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
    this.isLogin.next(false);
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

  public UpdatePassword(credentials: {
    newPassword: string;
    phoneOtp: string;
  }): Observable<IResponseModel> {
    return this.http.patch<IResponseModel>(
      this.api.baseApiUrl + 'auth/password/change',
      credentials,
    );
  }

  public UpdateUser(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
    const sigin = this.GetSignInData();
    sigin.user = user;
    localStorage.setItem('siginResponse', JSON.stringify(sigin));
    this.store.dispatch(UpdateProfileAction(user));
  }

  sendDeactivateSellerOTP() {
    return this.http.get(this.api.baseApiUrl + 'auth/deactivate/send-otp');
  }

  deactivateSeller(data: { otp: string }) {
    return this.http.put<OTPVerificationResponse>(
      this.api.baseApiUrl + 'auth/deactivate',
      data,
    );
  }

  sendActivateSellerOTP(data: { phoneNumber: string }) {
    return this.http.post(this.api.baseApiUrl + 'auth/activate/send-otp', data);
  }

  activateSeller(data: { email: string; otp: string }) {
    return this.http.put<OTPVerificationResponse>(
      this.api.baseApiUrl + 'auth/activate',
      data,
    );
  }

  //
  // public async  getWebSocketUrl(): Promise<string> {
  //   const referenceId = this.getUserReferenceNumber();
  //   const userId = this.getLoggedInUser()?.id?? '';
  //   const cachedUrl = this.getLocalStorageItemWithExpiry('notificationWssUrl');
  //   // const cachedUrl = '';
  //
  //   if(!cachedUrl){
  //     const path = this.api.notificationBaseUrl+`negotiate?referenceId=${referenceId}&userId=${userId}`;
  //     const wssUrlResponse = await firstValueFrom(this.http.get<GetWssUrlResponse>(path));
  //     if(wssUrlResponse?.wssUrl){
  //       this.setLocalStorageItemWithExpiry('notificationWssUrl',wssUrlResponse?.wssUrl, 60*24 )
  //       return  wssUrlResponse?.wssUrl
  //     }
  //    throw new Error('unable to retrieve wss url');
  //   }else {
  //    return  cachedUrl;
  //   }
  // }

  public getWebSocketUrl(): Observable<GetWssUrlResponse> {
    const referenceId = this.getUserReferenceNumber();
    const userId = this.getLoggedInUser()?.id ?? '';
    const cachedUrl = this.getLocalStorageItemWithExpiry('notificationWssUrl');

    // const cachedUrl = '';

    if (!cachedUrl) {
      const path =
        this.api.notificationBaseUrl +
        `negotiate?referenceId=${referenceId}&userId=${userId}`;
      const wssUrlResponse = this.http.get<GetWssUrlResponse>(path);
      wssUrlResponse.pipe(
        tap((a) => {
          this.setLocalStorageItemWithExpiry(
            'notificationWssUrl',
            a?.wssUrl,
            60 * 24,
          );
        }),
      );
      return wssUrlResponse;
    } else {
      return of({ wssUrl: cachedUrl } as GetWssUrlResponse);
    }
  }

  setLocalStorageItemWithExpiry(key, value: string, expiryInMinutes) {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + expiryInMinutes * 60 * 1000,
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

  async handleAuthResponse(res: any, accessType: string, authType: string) {
    try {
      uikit.modal('#information-modal').hide();
    } catch {}
    const user = res.data.user;

    H.identify(user.email, {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    datadogRum.setUser({
      id: user.id,
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
    });

    // @ts-ignore
    window.clarity(
      'identify',
      user.email,
      'custom-session-123',
      'custom-session-123',
      user.firstName + ' ' + user.lastName,
    );

    this.ngxService.stopAll();
    if (
      accessType === 'signin' &&
      authType === 'login' &&
      res.data.canLogin === false
    ) {
      this.ngxService.stopLoader('loader-01');
      this.toast.error('Please confirm your email address');

      if (this.currentUrl.includes('seller-form')) {
        this.hideSharedLoginModal();
        this.isLogin.next(true);
        this.SetAuthLocalStorage(res);
        return;
      }
      this.router.navigate(['/auth/confirm-email']);
      return;
    }
    if (res.data.canLogin === true) {
      this.applocal.currentUser.next(res.data.user);
      if (res.data.user.preferredProfileType.toLowerCase() === 'seller') {
        this.ngxService.stopLoader('loader-01');
        this.SetAuthLocalStorage(res);
        if (
          res.data.user.sellerApprovalStatus.toLowerCase() === 'approved' ||
          res.data.user.sellerApprovalStatus.toLowerCase() === 'failed' ||
          res.data.user.sellerApprovalStatus.toLowerCase() === 'pending'
        ) {
          if (this.currentUrl.includes('auth')) {
            this.router.navigate(['/seller/dashboard']);
            try {
              uikit.modal('#information-modal').hide();
            } catch {}
          } else {
            this.hideSharedLoginModal();
          }
        } else {
          if (this.currentUrl.includes('auth')) {
            this.router.navigate(['/']);
          } else {
            this.hideSharedLoginModal();
            this.hideSharedSignupModal();
          }
        }
      } else {
        this.ngxService.stopLoader('loader-01');
        this.isLogin.next(true);
        this.SetAuthLocalStorage(res);

        if (this.currentUrl.includes('auth')) {
          authType === 'login'
            ? this.router.navigate(['/'])
            : this.router.navigate(['/homepage']);
        } else {
          this.hideSharedLoginModal();
          this.hideSharedSignupModal();
        }
      }

      this.toast.success(
        `${accessType === 'signin' ? 'Login' : 'Signup'} Successful`,
      );
    }
    this.isLogin.next(true);
    this.SetAuthLocalStorage(res);
  }
}
