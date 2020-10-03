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
}
