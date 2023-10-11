import { IResponseModel } from './../../shared/models/IResponseModel';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  IUpdateUser,
  IUserResponse,
  PostAddressReturnData,
  UserAddressData,
  UserAddressRawInfo,
} from './../../models/IUserModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiAppUrlService } from '../api-app-url.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isPhoneVerified = new Subject<boolean>();
  isEditingUserInfo = new BehaviorSubject<boolean>(false);
  userProfileUpdated = new BehaviorSubject<boolean>(true);
  userActivated = new Subject<boolean>();
  constructor(private api: ApiAppUrlService, private http: HttpClient) {}

  updateUser(userInfo: IUpdateUser): Observable<IResponseModel> {
    return this.http.put<IResponseModel>(
      this.api.baseApiUrl + 'users',
      userInfo
    );
  }

  getCurrentUser(): Observable<IUserResponse> {
    return this.http.get<IUserResponse>('auth/getcurrentuser');
  }

  getUserById(userId: string): Observable<IUserResponse> {
    return this.http.get<IUserResponse>(
      this.api.baseApiUrl + `users/${userId}`
    );
  }

  getUserAddress(userId: string) {
    return this.http
      .get<UserAddressRawInfo>(
        this.api.ecommerceBaseUrl + 'useraddress/users/' + userId
      )
      .pipe(
        map((data) => {
          return data.data.data;
        })
      );
  }

  addUserAddress(data: UserAddressData) {
    return this.http.post<PostAddressReturnData>(
      this.api.ecommerceBaseUrl + 'useraddress',
      data
    );
  }

  updateUserAddress(id: string, data: UserAddressData) {
    return this.http.put(this.api.ecommerceBaseUrl + 'useraddress/' + id, data);
  }

  deleteUserAddress(id: string) {
    return this.http.delete(this.api.ecommerceBaseUrl + 'useraddress/' + id);
  }
}
