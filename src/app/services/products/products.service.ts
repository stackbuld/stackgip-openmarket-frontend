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
  SingleProductResponse,
} from '../../models/products.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CategoryResponse } from './../../models/CategoryModels';
import { IUser } from 'src/app/models/IUserModel';
import { HttpClient } from '@angular/common/http';
import { ApiAppUrlService } from '../api-app-url.service';
import { Injectable } from '@angular/core';
import { map, retry } from 'rxjs/operators';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  baseUrl = '';
  newProductUnit = new Subject<number>();
  exceededUnitAction = new BehaviorSubject<boolean>(false);
  scrollTo = new Subject<boolean>();

  constructor(
    private apiUrls: ApiAppUrlService,
    private http: HttpClient,
    private meta: Meta
  ) {
    this.baseUrl = apiUrls.ecommerceBaseUrl;
  }

  public GetCategory(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(this.baseUrl + 'categories');
  }

  updateMetaTags(data: ProductModel) {
    return [
      {
        name: 'description',
        content: data.description,
      },
      {
        name: 'keywords',
        content:
          'business,buy,btc,commerce,crypto,cryptocurrency,currency,customer,delivery,ecommerce,flexible,market,online,online payment,online shopping,online store, rena,renafam,renamarket,payment,product,purchase,safe,sales,secure,sell,shop,shopping,transaction',
      },
      {
        property: 'og:title',
        content: 'RENAMARKET - ' + data.name,
      },
      {
        property: 'og:description',
        content: 'RENAMARKET - ' + data.description,
      },
      {
        property: 'og:url',
        content:
          'https://renamarkets.com/homepage/product/2b9610d8-fc3e-4aa0-86a4-0a8e11f720b9' +
          data.id,
      },
      {
        property: 'og:site_name',
        content: 'Renamarket',
      },
      {
        property: 'og:image',
        content: data.imageUrl,
      },
      {
        property: 'og:logo',
        content:
          'https://res.cloudinary.com/dbmgmudf0/image/upload/v1680620527/Rena-market-OG-meta-2_rpkpjp.jpg',
        size: '250x250',
      },
      {
        property: 'og:keywords',
        content:
          'business,buy,btc,commerce,crypto,cryptocurrency,currency,customer,delivery,ecommerce,flexible,market,online,online payment,online shopping,online store, rena,renafam,renamarket,payment,product,purchase,safe,sales,secure,sell,shop,shopping,transaction ',
      },
      {
        property: 'og:image:secure_url',
        content:
          'https://res.cloudinary.com/dbmgmudf0/image/upload/v1680620527/Rena-market-OG-meta-2_rpkpjp.jpg',
      },
      {
        property: 'twitter:image',
        content: data.imageUrl,
      },
    ];
  }

  getProducts(
    pageNumber: number = 1,
    maxItem = 50,
    search = '',
    categoryId = '',
    minPrice = 10,
    maxPrice = 500000
  ): Observable<ProductsApiModel> {
    return this.http.get<ProductsApiModel>(
      this.baseUrl +
        `products?pageNumber=${pageNumber}&maxItem=${maxItem}&search=${search}&categoryId=${categoryId}&minSalePrice=${minPrice}&maxSalePrice=${maxPrice}`
    );
  }

  getSellerProducts(
    userId: string,
    pageNumber: number = 1,
    maxItem = 50,
    search = '',
    categoryId = '',
    min = 10,
    max = 500000,
    type = 'All',
    startDate = '',
    endDate = '',
    productSort = 'Date',
    byAscending = false,
    productStatus?: string | null
  ): Observable<ProductsApiModel> {
    return this.http.get<ProductsApiModel>(
      this.baseUrl +
        `seller/${userId}/products?pageNumber=${pageNumber}&maxItem=${maxItem}&search=${search}&min=${min}&max=${max}&categoryId=${categoryId}&type=${type}&startDate=${startDate}&endDate=${endDate}&productSort=${productSort}&byAscending=${byAscending}${
          productStatus && '&status=' + productStatus
        }`
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
      this.baseUrl + 'products',
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

  getCategoriesData(id: string): Observable<ProductModel[]> {
    return this.http.get(this.baseUrl + `products/categories/${id}`).pipe(
      map((res: any) => {
        return res?.data?.data;
      })
    );
  }

  getLowStockProducts(data: {
    userId: string;
    pageNumber: number;
    maxItem: number;
  }): Observable<any> {
    return this.http.get(
      this.baseUrl +
        `seller/${data.userId}/low-stocks?PageNumber=${data.pageNumber}&MaxItem=${data.maxItem}`
    );
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

  getVariations(userId?: any): Observable<any> {
    if (userId) {
      return this.http.get(
        this.baseUrl + `productoption/variations?userId=${userId}`
      );
    } else {
      return this.http.get(this.baseUrl + `productoption/variations`);
    }
  }

  createNewProduct(payload: any): Observable<any> {
    // for (let index = 0; index < payload.variations.length; index++) {
    //   const element = payload.variations[index];
    //   payload.options.push(element);
    // }
    // delete payload.variations;
    return this.http.post(this.baseUrl + `products`, payload);
  }

  updateProduct(payload: any, productId: any): Observable<any> {
    // for (let index = 0; index < payload.variations.length; index++) {
    //   const element = payload.variations[index];
    //   payload.options.push(element);
    // }
    // delete payload.variations;
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

  getMostSelling(userId: string = ''): Observable<MostSellingResponse> {
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

  getCachedProductById(productId: string): Observable<SingleProductResponse> {
    return this.http.get<any>(this.baseUrl + `products/${productId}/cached`);
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
