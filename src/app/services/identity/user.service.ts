import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiAppUrlService } from "./../api-app-url.service";
import { Injectable } from "@angular/core";
import { IUserResponse } from "src/app/models/IUserModel";

@Injectable({
  providedIn: "root",
})
export class UserService {
  baseApi: string;
  constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {
    this.baseApi = this.apiUrls.baseApiUrl;
  }

  getCurrentUser(): Observable<IUserResponse> {
    return this.http.get<IUserResponse>("auth/getcurrentuser");
  }
}
