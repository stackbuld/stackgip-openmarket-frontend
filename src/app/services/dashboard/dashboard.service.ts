
import { HttpClient } from "@angular/common/http";
import { ApiAppUrlService } from "../api-app-url.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  baseUrl = "";

  constructor(
    private apiUrls: ApiAppUrlService, private http: HttpClient) {
    this.baseUrl = apiUrls.ecommerceBaseUrl;
  }

  getSellerDashboardSummary(userId: any): Observable<any> {
    return this.http.get(this.baseUrl + `seller/${userId}/overview`);
  }

  getMostSellingProducts(userId: any): Observable<any> {
    return this.http.get(this.baseUrl + `seller/${userId}/most-selling`);
  }
  
}
