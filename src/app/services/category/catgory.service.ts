import { CategoryResponse, ICategory } from './../../models/CategoryModels';
import { Observable, from, of, retry, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiAppUrlService } from '../api-app-url.service';
import { ICatgoryService } from './ICatgoryService.interface';
import { environment } from 'src/environments/environment';
import algoliasearch from 'algoliasearch';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.apiKey
);

@Injectable({
  providedIn: 'root',
})
export class CatgoryService implements ICatgoryService {
  config = {
    indexName: environment.algolia.indexName,
    searchClient,
  };
  index = searchClient.initIndex(this.config.indexName);

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

  fetchAllCategoryNames() {
    return this.index.searchForFacetValues('category.name', '');
  }

  getAllCategories(): Observable<string[]> {
    const categoryResults = this.fetchAllCategoryNames();
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
