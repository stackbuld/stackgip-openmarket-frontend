import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import algoliasearch from 'algoliasearch';
import { IProductPage, ProductModel } from '../../models/products.model';
import { ISearchService } from './iSearchService.interface';
import { Observable, Subject, from, tap, delay, of, switchMap } from 'rxjs';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.apiKey
);

@Injectable({
  providedIn: 'root',
})
export class SearchService implements ISearchService {
  config = {
    indexName: environment.algolia.indexName,
    searchClient,
  };
  index = searchClient.initIndex(this.config.indexName);

  constructor() {}

  getAlgoliaConfig() {
    return this.config;
  }

  getIndex() {
    return;
  }

  fetchSearchResults(
    searchQuery: string,
    currentPage: number,
    maxItem: number,
    filters: string
  ) {
    console.log('SEARCH QUERY');
    return this.index.search(searchQuery, {
      hitsPerPage: maxItem,
      page: currentPage,
      filters,
      facets: ['*'],
    });
  }

  convertToProductModel(hits: any): ProductModel[] {
    // Converting searchResult data into ProductModel type
    let results: ProductModel[] = hits.map((product) => {
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
    return results;
  }

  convertToIProductPage(data: any): IProductPage {
    let results = this.convertToProductModel(data.hits);

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
      },
    };
    return formattedResults;
  }

  getAllProducts(
    pageNumber: number = 0,
    maxItem: number = 10,
    searchQuery: string = '',
    categoryId: string = '',
    minPrice: number = 10,
    maxPrice: number = 50000,
    isFilter?: boolean
  ): Observable<ProductModel[]> {
    let filters = `price:${minPrice} TO ${maxPrice}`;
    if (categoryId) {
      filters += ` AND categoryId:${categoryId}`;
    }

    let tempHits: ProductModel[] = [];
    let formattedResults: Observable<ProductModel[]>;

    for (let firstPage = 0; firstPage < pageNumber + 1; firstPage++) {
      formattedResults = from(
        this.fetchSearchResults(searchQuery, pageNumber, maxItem, filters)
      ).pipe(
        switchMap((data) => {
          const formattedHits = this.convertToProductModel(data.hits);

          if (pageNumber === 0 || isFilter === true) {
            tempHits = formattedHits;
          } else {
            tempHits = [...tempHits, ...formattedHits];
          }
          return of(tempHits);
        })
      );
    }

    return formattedResults;
  }
}
