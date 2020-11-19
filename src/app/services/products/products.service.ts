import {
  CreateProductModel,
  CreateProductResponse,
} from "./../../models/products.model";
import { Observable } from "rxjs";
import { ProductsApiModel } from "../../models/products.model";
import { ProductModel } from "../../models/products.model";
import { MostSellingResponse, OverviewApiModel } from "../../models/products.model";
import { IUser } from 'src/app/models/IUserModel';
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
    maxItem = 50,
    search = "",
    categoryId = ""
  ): Observable<ProductsApiModel> {
    return this.http.get<ProductsApiModel>(
      this.baseUrl +
        `products?pageNumber=${pageNumber}&maxItem=${maxItem}&search=${search}&categoryId=${categoryId}`
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


  createProduct(
    product: CreateProductModel
  ): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(
      this.baseUrl + "products",
      product
    );
  }

  getProductId(
    pid: ProductModel
   ): Observable<ProductModel> {
     return this.http.get<ProductModel>(
       this.baseUrl +
         `products?id=${pid.id}`
     );
   }

   getProductOverview(
    userId: string,
    // Type: string,
    // startDate: string = "",
    // endDate: string = "",

  ): Observable<OverviewApiModel> {
    return this.http.get<OverviewApiModel>(
      this.baseUrl + `seller/${userId}/overview/` //?Type${Type}&StartDate${startDate}&EndDate${endDate}
    );
  }

  getMostSelling(
    userId:string = ""
  ): Observable<MostSellingResponse> {
    return this.http.get<MostSellingResponse>(
      this.baseUrl + `seller/${userId}/most-selling`
    );
  }

  getNewOrders(
    userId: IUser,
    PageNumber: number = 1,
    MaxIttem = 4

  ): Observable<ProductsApiModel> {
    return this.http.get<ProductsApiModel>(
      this.baseUrl + `seller/${userId.id}/orders/new/?pageNumber${PageNumber}&MaxItem${MaxIttem}`
    );
  }

}


