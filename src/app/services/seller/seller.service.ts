import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IUser, UserDataResponse } from 'src/app/models/IUserModel';
import {
  GetSeller,
  ISeller,
  SellerBusinessProfileData,
  SellerProfileData,
} from 'src/app/models/sellerModel';
import { ResponseModel } from 'src/app/shared/models/ResponseModel';
import { ApiAppUrlService } from '../api-app-url.service';
import { RequestService } from '../request/request.service';

import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  loggedInUser: IUser = {} as IUser;
  baseUrl = '';
  sellerRegisterationFormStatus = {
    approved: 'approved',
    pending: 'pending',
    canceled: 'canceled',
    nully: 'nully',
  };
  phoneNumberConfirmed = new Subject<boolean>();
  businessPhoneConfirmed = new Subject<boolean>();
  isSellerActivated = new Subject<boolean>();
  newProfilePicture = new Subject<string>();

  constructor(
    private reqS: RequestService,
    private apiUrls: ApiAppUrlService,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.baseUrl = this.apiUrls.baseApiUrl;
    this.loggedInUser = this.authService.getLoggedInUser();
  }

  registerSeller(data: any) {
    // const query = `${ this.baseUrl }users/${ this.loggedInUser.id }/seller`;
    const query = `${this.baseUrl}sellers/verification`;
    return this.reqS.post<ResponseModel>(query, data).pipe(
      switchMap((val) => {
        return this.updateUserSellerDetails(val, data);
      })
    );
  }

  updateUserSellerDetails(val: ResponseModel, data: ISeller): Observable<any> {
    const loggedInUser = this.authService.getLoggedInUser();
    const newData = {
      ...loggedInUser,
      ...data,
      sellerApprovalStatus: this.sellerRegisterationFormStatus.pending,
    };
    localStorage.setItem('user', JSON.stringify(newData));
    return of({
      user: {
        ...newData,
      },
      response: {
        ...val,
      },
    });
  }

  getSeller(id: string) {
    return this.http.get<UserDataResponse>(this.baseUrl + 'sellers/' + id);
  }

  getSellerById(id: string): Observable<GetSeller> {
    return this.http.get<GetSeller>(this.baseUrl + `users/${id}`);
  }

  updateSellerPersonalProfile(profileData: SellerProfileData) {
    return this.http.put(this.baseUrl + 'users', profileData);
  }

  updateSellerBusinessProfile(businessData: SellerBusinessProfileData) {
    return this.http.put(this.baseUrl + 'sellers/business', businessData);
  }

  verifyPhoneNumber() {
    return this.http.get(this.baseUrl + 'users/phonenumber/send-otp');
  }
}
