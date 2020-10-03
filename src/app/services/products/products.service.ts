import { Observable } from "rxjs";
import { ProductsApiModel } from "../../models/products.model";
import { HttpClient } from "@angular/common/http";
import { ApiAppUrlService } from "../api-app-url.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  baseUrl = "";
  constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {
    this.baseUrl = apiUrls.ecommerceBaseUrl;
  }

  getProducts(
    pageNumber: number = 1,
    maxItem = 50
  ): Observable<ProductsApiModel> {
    return this.http.get<ProductsApiModel>(
      this.baseUrl + `products?pageNumber=${pageNumber}&maxItem=${maxItem}`
    );
  }

  getNewProducts(
    pageNumber: number = 1,
    maxItem = 50
  ): Observable<ProductsApiModel> {
    return this.http.get<ProductsApiModel>(
      this.baseUrl + `products/new/?pageNumber=${pageNumber}&maxItem=${maxItem}`
    );
  }
}
