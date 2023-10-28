import { Injectable } from '@angular/core';
import algoliasearch from "algoliasearch";
import { environment } from 'src/environments/environment';
import {ISearchService} from '../search/iSearchService.interface';
import {IProductPage} from '../../models/products.model';
import {Observable} from 'rxjs';

const searchClient = algoliasearch(environment.algolia.appId, environment.algolia.apiKey);

@Injectable({
  providedIn: 'root'
})
export class AlgProductsService implements  ISearchService{
  config = {
    indexName: environment.algolia.indexName,
    searchClient,
  };

  constructor() { }

  getAlgoliaConfig() {
    return this.config;
  }

  runAlgoliaSearch(searchQuery: string) {
    const index = searchClient.initIndex(this.config.indexName);
    return index.search(searchQuery);
  }

  getProducts(pageNumber?: number, maxItem?: number, search?: string, categoryId?: string, minPrice?: number, maxPrice?: number): Observable<IProductPage> {
    return undefined;
  }
}
