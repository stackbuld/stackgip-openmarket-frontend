import {
  ProductsApiModel,
  ProductModel,
  CreateProductOption,
  ProductShipment,
  CreateProductModel,
  CreateProductResponse,
  EditProductItem,
  MostSellingResponse,
  OverviewApiModel,
  CreateProductOptionResponse,
  ProductShipmentResponse,
  CreateShipmentModel,
} from "../../models/products.model";
import { Observable } from "rxjs";
import { IUser } from "src/app/models/IUserModel";
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
    categoryId = "",
    minPrice = 10,
    maxPrice = 500000
  ): Observable<ProductsApiModel> {
    return this.http.get<ProductsApiModel>(
      this.baseUrl +
        `products?pageNumber=${pageNumber}&maxItem=${maxItem}&search=${search}&categoryId=${categoryId}&minPrice=${minPrice}&maxPrice=${maxPrice}`
    );
  }

  getSellerProducts(
    userId: string,
    pageNumber: number = 1,
    maxItem = 50,
    search = "",
    categoryId = ""
  ): Observable<ProductsApiModel> {
    return this.http.get<ProductsApiModel>(
      this.baseUrl +
        `seller/${userId}/products?pageNumber=${pageNumber}&maxItem=${maxItem}&search=${search}&categoryId=${categoryId}`
      // this.baseUrl +
      //   `products?pageNumber=${pageNumber}&maxItem=${maxItem}&search=${search}&categoryId=${categoryId}`
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

  UpdateProduct(
    productId: number,
    product: CreateProductModel
  ): Observable<CreateProductResponse> {
    return this.http.put<CreateProductResponse>(
      `${this.baseUrl}products/${productId}`,
      product
    );
  }

  getProductId(pid: ProductModel): Observable<ProductModel> {
    return this.http.get<ProductModel>(this.baseUrl + `products?id=${pid.id}`);
  }

  getProductOverview(
    userId: string
    // Type: string,
    // startDate: string = "",
    // endDate: string = "",
  ): Observable<OverviewApiModel> {
    return this.http.get<OverviewApiModel>(
      this.baseUrl + `seller/${userId}/overview/` //?Type${Type}&StartDate${startDate}&EndDate${endDate}
    );
  }

  getMostSelling(userId: string = ""): Observable<MostSellingResponse> {
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
      this.baseUrl +
        `seller/${userId.id}/orders/new/?pageNumber${PageNumber}&MaxItem${MaxIttem}`
    );
  }

  getProductById(productId: string): Observable<EditProductItem> {
    return this.http.get<EditProductItem>(
      this.baseUrl + `products/${productId}`
    );
  }

  deleteProduct(productId: number) {
    return this.http.delete(this.baseUrl + `products/${productId}`);
  }

  createProductOption(
    productId: number,
    option: CreateProductOption
  ): Observable<CreateProductOptionResponse> {
    return this.http.post<CreateProductOptionResponse>(
      this.baseUrl + `productoption?productId=${productId}`,
      option
    );
  }

  UpdateProductOption(
    productOptionId: number,
    productOption: CreateProductOption
  ): Observable<CreateProductOptionResponse> {
    return this.http.put<CreateProductOptionResponse>(
      `${this.baseUrl}productoption/${productOptionId}`,
      productOption
    );
  }

  deleteProductOption(productOptionId: number) {
    return this.http.delete(this.baseUrl + `productoption/${productOptionId}`);
  }

  createProductShipment(
    productId: number,
    shipment: CreateShipmentModel
  ): Observable<ProductShipmentResponse> {
    return this.http.post<ProductShipmentResponse>(
      this.baseUrl + `productshipment?productId=${productId}`,
      shipment
    );
  }

  UpdateProductShipment(
    productShipmentId: number,
    productOption: ProductShipment
  ): Observable<ProductShipmentResponse> {
    return this.http.put<ProductShipmentResponse>(
      `${this.baseUrl}productshipment/${productShipmentId}`,
      productOption
    );
  }

  deleteProductShipment(productShipmentId: number) {
    return this.http.delete(
      `${this.baseUrl}productshipment/${productShipmentId}`
    );
  }
}
