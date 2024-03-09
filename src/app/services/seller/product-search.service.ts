import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiAppUrlService } from '../api-app-url.service';
import {
  ProductSearchResult,
  ProductsApiModel,
  PromotedProduct,
} from 'src/app/models/products.model';

@Injectable({ providedIn: 'root' })
export class ProductSearchService {
  baseUrl = '';
  searchResults = new BehaviorSubject<ProductSearchResult[]>([]);
  isSearching = new Subject<boolean>();
  isFetching = new Subject<boolean>();
  clearSearchInput = new Subject<boolean>();

  constructor(
    private apiUrls: ApiAppUrlService,
    private http: HttpClient,
  ) {
    this.baseUrl = apiUrls.ecommerceBaseUrl;
  }

  getProducts(data: {
    maxItem?: 50;
    search: string;
    categoryId?: '';
    minPrice?: 10;
    maxPrice?: 500000;
    userId: string;
  }): Observable<ProductSearchResult[]> {
    return this.http
      .get<ProductsApiModel>(
        this.baseUrl + `seller/${data.userId}/products?search=${data.search}`,
      )
      .pipe(
        map((res) => {
          const refinedResponse: ProductSearchResult[] = [];

          res.data.data.map((item) => {
            const { name, imageUrl, id } = item;

            refinedResponse.push({
              name: name,
              imageUrl: imageUrl,
              id: id.toString(),
            });
          });
          console.log(refinedResponse);
          return refinedResponse;
        }),
      );
  }
}
