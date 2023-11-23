import { CategoryResponse, ICategory } from './../../models/CategoryModels';
import { Observable, from, of, retry, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiAppUrlService } from '../api-app-url.service';
import { ICatgoryService } from './ICatgoryService.interface';
import { environment } from 'src/environments/environment';
import algoliasearch from 'algoliasearch';

// const searchClient = algoliasearch(
//   environment.algolia.productsIndex.appId,
//   environment.algolia.productsIndex.apiKey
// );

const searchClient = algoliasearch(
  environment.algolia.categoriesIndex.appId,
  environment.algolia.categoriesIndex.apiKey
);

const facetToRetrieve = 'category.name';
const filterAttribute = 'userId';

@Injectable({
  providedIn: 'root',
})
export class CatgoryService implements ICatgoryService {
  // config = {
  //   indexName: environment.algolia.productsIndex.indexName,
  //   searchClient,
  // };
  // index = searchClient.initIndex(environment.algolia.productsIndex.indexName);
  index = searchClient.initIndex(environment.algolia.categoriesIndex.indexName);

  baseUrl: string;
  constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {
    this.baseUrl = apiUrls.ecommerceBaseUrl;
  }

  public GetCategory(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(this.baseUrl + 'categories');
  }

  getCategoryByUserId(id: string): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(
      this.baseUrl + `categories?userId=${id}`
    );
  }

  getAllCategories(searchItem: string = ''): Observable<ICategory[]> {
    let searchClientResults = this.index.search(searchItem);

    let formattedCategories = from(searchClientResults).pipe(
      switchMap((data) => {
        const hits = data.hits.map((category) => {
          return this.convertToICategory(category);
        });
        return of(hits);
      })
    );

    return formattedCategories;
  }

  convertToICategory(category: any): ICategory {
    return {
      id: category.id,
      name: category.name,
      imageUrl: category.imageUrl,
      createdOn: category.createdOn,
    };
  }

  getAllSellerStorefrontCategories(
    categoryId: string
  ): Observable<ICategory[]> {
    let searchClientResults = this.index.search('', {
      filters: `id:${categoryId}`,
    });

    let formattedCategories = from(searchClientResults).pipe(
      switchMap((data) => {
        const hits = data.hits.map((category) => {
          return this.convertToICategory(category);
        });
        return of(hits);
      })
    );

    return formattedCategories;
  }
}
