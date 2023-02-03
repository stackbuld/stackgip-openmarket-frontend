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
import { CategoryResponse } from "./../../models/CategoryModels";
import { IUser } from "src/app/models/IUserModel";
import { HttpClient } from "@angular/common/http";
import { ApiAppUrlService } from "../api-app-url.service";
import { Injectable } from "@angular/core";
import { retry } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  baseUrll = "";
  baseUrl = "";

  constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {
    this.baseUrl = apiUrls.ecommerceBaseUrl;
  }

  public GetCategory(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(this.baseUrll + "categories");
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
    categoryId = "",
    min = 10,
    max = 500000,
    type = "All",
    startDate = "",
    endDate = "",
    productSort = "Date",
    byAscending = false
  ): Observable<ProductsApiModel> {
    return this.http.get<ProductsApiModel>(
      this.baseUrl +
        `seller/${userId}/products?pageNumber=${pageNumber}&maxItem=${maxItem}&search=${search}&min=${min}&max=${max}&categoryId=${categoryId}&type=${type}&startDate=${startDate}&endDate=${endDate}&productSort=${productSort}&byAscending=${byAscending}`
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

  getProduct(id: any): Observable<any> {
    return this.http.get(this.baseUrl + `products/${id}`);
  }

  getLowStockProducts(): Observable<any> {
    return this.http.get(this.baseUrl + `products/low-stocks`);
  }

  productOrderSummary(userId: string, productId: any): Observable<any> {
    return this.http.get(
      this.baseUrl + `seller/${userId}/products/${productId}/overview`
    );
  }

  getProductsOverviewPerUser(userId: string): Observable<any> {
    return this.http.get(this.baseUrl + `seller/${userId}/overview`);
  }

  getSubCategories(categoryId: string): Observable<any> {
    return this.http.get(
      this.baseUrl + `categories?BaseCategoryId=${categoryId}`
    );
  }

  createVariation(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + `productoption/variations`, payload);
  }

  getAllCategories(): Observable<any> {
    return this.http.get(this.baseUrl + `categories`);
  }

  getVariations(categoryId?: any): Observable<any> {
    if (categoryId) {
      return this.http.get(
        this.baseUrl + `productoption/variations?categoryId=${categoryId}`
      );
    } else {
      return this.http.get(this.baseUrl + `productoption/variations`);
    }
  }

  createNewProduct(payload: any): Observable<any> {
    for (let index = 0; index < payload.variations.length; index++) {
      const element = payload.variations[index];
      payload.options.push(element);
    }
    delete payload.variations;
    return this.http.post(this.baseUrl + `products`, payload);
  }

  updateProduct(payload: any, productId: any): Observable<any> {
    for (let index = 0; index < payload.variations.length; index++) {
      const element = payload.variations[index];
      payload.options.push(element);
    }
    delete payload.variations;
    return this.http.put(this.baseUrl + `products/${productId}`, payload);
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

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(this.baseUrl + `products/${productId}`);
  }

  updateProductUnit(productId: any, payload: any): Observable<any> {
    return this.http.put(this.baseUrl + `products/${productId}/unit`, payload);
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
