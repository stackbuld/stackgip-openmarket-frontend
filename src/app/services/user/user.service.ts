import { IResponseModel } from "./../../shared/models/IResponseModel";
import { Observable } from "rxjs";
import { IUpdateUser, IUserResponse } from "./../../models/IUserModel";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiAppUrlService } from "../api-app-url.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private api: ApiAppUrlService, private http: HttpClient) {}

  updateUser(userInfo: IUpdateUser): Observable<IResponseModel> {
    return this.http.put<IResponseModel>(
      this.api.baseApiUrl + "users",
      userInfo
    );
  }

  getCurrentUser(): Observable<IUserResponse> {
    return this.http.get<IUserResponse>("auth/getcurrentuser");
  }

  getUserById(userId:string):
  Observable<IUserResponse>{
    return this.http.get<IUserResponse>(
      this.api.baseApiUrl + `users/${userId}`
    );
  }

  createAddress(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api.ecommerceBaseUrl}useraddress`, payload);
  }

  fetchUserAddresses(userId: any): Observable<any> {
    return this.http.get<any>(`${this.api.ecommerceBaseUrl}useraddress/users/${userId}`);
  }

  setDefaultAddress(payload: any, id: string): Observable<any> {
    return this.http.put<any>(`${this.api.ecommerceBaseUrl}useraddress/${id}`, payload);
  }

  deleteAddress(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api.ecommerceBaseUrl}useraddress/${id}`);
  }

  getShippingEstimate(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api.ecommerceBaseUrl}shipping/price-estimates`, payload);
  }

}
