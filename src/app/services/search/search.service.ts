import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import algoliasearch from "algoliasearch";
import SearchResponse from "algoliasearch/lite";
import {IProductPage, ProductModel} from '../../models/products.model';
import { ISearchService } from './iSearchService.interface';
import { Observable } from 'rxjs';

const searchClient = algoliasearch(environment.algolia.appId, environment.algolia.apiKey);

@Injectable({
  providedIn: 'root'
})
export class SearchService implements ISearchService {
  config = {
    indexName: environment.algolia.indexName,
    searchClient,
  };
  index = searchClient.initIndex(this.config.indexName);
  hits: Observable<IProductPage> = new Observable<IProductPage>();

  constructor() { }

  getAlgoliaConfig() {
    return this.config;
  }

  search(searchQuery: string) {
    let results;
    this.index.search(searchQuery).then(res => results = res);
    return results;
  }

  getProducts(pageNumber: number = 1, maxItem: number = 50, searchQuery: string = '', categoryId: string = '', minPrice: number = 10, maxPrice: number = 50000): Observable<IProductPage> {
    try {
      /* The code block is performing a transformation on the search results obtained from the Algolia
      index to a ProductModel type */
      let tempResults = [];
      let results = this.search(searchQuery);

      // tempResults = results.hits;
      tempResults = tempResults.map(product => {
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
      of a search query. */
      let tempHits: IProductPage = {
        data: tempResults,
        pager: {
          pageNumber: results.page,
          pageCount: results.nbPages,
          pageSize: results.hitsPerPage,
          hasNextPage: results.page < results.nbPages,
          hasPreviousPage: results.page > 1,
          firstItemOnPage: results.hitsPerPage * (results.page - 1) + 1,
          lastItemOnPage: results.hitsPerPage * (results.page - 1) + results.hitsPerPage,
          totalItemCount: results.nbHits,
        }
      };

      this.hits = new Observable<IProductPage>(observer => {
        observer.next(tempHits);
      });

      return this.hits;
    } catch (err) {
      console.log(err);
    }
  }

  
}
