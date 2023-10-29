import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import algoliasearch from "algoliasearch";
import {IProductPage, ProductModel} from '../../models/products.model';
import { ISearchService } from './iSearchService.interface';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const searchClient = algoliasearch(environment.algolia.appId, environment.algolia.apiKey);

@Injectable({
  providedIn: 'root'
})
export class SearchService implements ISearchService {
  config = {
    indexName: environment.algolia.indexName,
    searchClient,
  };

  constructor() { }

  getAlgoliaConfig() {
    return this.config;
  }

  fetchSearchResults(searchQuery: string) {
    const index = searchClient.initIndex(this.config.indexName);
    return index.search(searchQuery);
  }

  processResults(data: any): IProductPage {
    // Converting searchResult data into ProductModel type
    let results: ProductModel[] = data.hits.map(product => {
      return {
        name: product.name,
        previousPrice: product.previousPrice,
        price: product.price,
        category: {
          description: product.category.description,
          id: product.category.id,
          name: product.category.name,
          createdOn: product.category.createdOn,
        },
        categoryId: product.categoryId,
        createdOn: product.createdOn,
        description: product.description,
        id: product.id,
        imageUrl: product.imageUrl,
        paymentOptions: product.paymentOptions,
        productImages: product.productImages,
        unit: product.unit,
      };
    });
    /* The `tempHits` variable is an object of type `IProductPage`. It represents the paginated results
    of a search query. It contains the following properties: 
    It's the final data that'll be used in the product-list component through subscription
    */
    let formattedResults: IProductPage = {
      data: results,
      pager: {
        pageNumber: data.page,
        pageCount: data.nbPages,
        pageSize: data.hitsPerPage,
        hasNextPage: data.page < data.nbPages,
        hasPreviousPage: data.page > 1,
        firstItemOnPage: data.hitsPerPage * (data.page - 1) + 1,
        lastItemOnPage: data.hitsPerPage * (data.page - 1) + data.hitsPerPage,
        totalItemCount: data.nbHits,
      }
    };
    return formattedResults;
  }

  getProducts(pageNumber: number = 1, maxItem: number = 50, searchQuery: string = '', categoryId: string = '', minPrice: number = 10, maxPrice: number = 50000): Observable<IProductPage> {
    return from(this.fetchSearchResults(searchQuery)).pipe(
      switchMap(data => {
        const processedResults = this.processResults(data);
        return of(processedResults);
      })
    );
  }
}
