import { StoreResponse } from "../../models/StoreModels";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiAppUrlService } from "../api-app-url.service";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  baseUrl: string;
  constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {
    this.baseUrl = apiUrls.storeBaseUrl;
  }

  getStoresByUserId(id: string): Observable<StoreResponse> {
    return this.http.get<StoreResponse>(
      this.baseUrl + `sellerstores/stores/user/userid?Id=${id}`
    );
  }

  getStoresById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + `sellerstores/stores/user/${id}`);
  }

}
