import { CategoryResponse, ICategory } from './../../models/CategoryModels';
import { Observable, from, of, map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiAppUrlService } from '../api-app-url.service';
import { ICategoryService } from './ICategoryService.interface';
import { environment } from 'src/environments/environment';
import algoliasearch from 'algoliasearch';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.apiKey
);

// const searchClient = algoliasearch(
//   environment.algolia.categoriesIndex.appId,
//   environment.algolia.categoriesIndex.apiKey
// );

const facetToRetrieve = 'category.name';
const filterAttribute = 'userId';

@Injectable({
  providedIn: 'root',
})
export class CategoryService implements ICategoryService {
  // config = {
  //   indexName: environment.algolia.indexName,
  //   searchClient,
  // };
  categoriesIndex = searchClient.initIndex(
    environment.algolia.indexName.categories
  );

  index = searchClient.initIndex(environment.algolia.indexName.products);

  baseUrl: string;
  constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {
    this.baseUrl = apiUrls.ecommerceBaseUrl;
  }

  public GetCategory(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(this.baseUrl + 'categories');
  }

  public getCategory(id: string): Observable<CategoryResponse<ICategory>> {
    return this.http.get<CategoryResponse<ICategory>>(
      `${this.baseUrl}categories/${id}`
    );
  }

  getCategoryByUserId(id: string): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(
      this.baseUrl + `categories?userId=${id}`
    );
  }

  getAllCategories(storefrontSellerId?: string) {
    const categoryResults = this.index.searchForFacetValues(
      facetToRetrieve,
      '',
      {
        facetFilters: [[`${filterAttribute}:${storefrontSellerId}`]],
      }
    );
    let tempCategories: string[] = [];

    let formattedCategories = from(categoryResults).pipe(
      switchMap((data) => {
        const facetHits = this.sortByCount(data.facetHits);
        tempCategories = facetHits.map((hits) => hits.value);
        return of(tempCategories);
      })
    );
    return formattedCategories;
  }

  getAllStorefrontCategories(): Observable<ICategory[]> {
    const data = this.categoriesIndex.search('');
    return from(data).pipe(
      map((data) => {
        const categories = this.convertToICategory(data.hits);
        return categories;
      })
    );
  }

  sortByCount(array: any[]) {
    return array.sort((a, b) => {
      let orderNumberA = a.count ? a.count : Number.MAX_SAFE_INTEGER;

      let orderNumberB = b.count ? b.count : Number.MAX_SAFE_INTEGER;

      return orderNumberA - orderNumberB;
    });
  }

  convertToICategory(categories: any[]): ICategory[] {
    const data: ICategory[] = [];
    categories.forEach((category) => {
      const orderedCategory = {
        id: category.id,
        name: category.name,
        imageUrl: category.imageUrl,
        createdOn: category.createdOn,
        orderingNumber: category.orderingNumber,
      };
      data.push(orderedCategory);
    });
    return data;
  }

  searchCategories(
    searchItem: string,
    storefrontSellerId: string
  ): Observable<string[]> {
    const categoryResults = this.index.searchForFacetValues(
      facetToRetrieve,
      searchItem,
      {
        facetFilters: [[`${filterAttribute}:${storefrontSellerId}`]],
      }
    );

    let tempCategories: string[] = [];

    let formattedCategories = from(categoryResults).pipe(
      switchMap((data) => {
        const facetHits = data.facetHits;
        tempCategories = facetHits.map((hits) => hits.value);
        return of(tempCategories);
      })
    );

    return formattedCategories;
  }
}
