import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
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
  index: SearchIndex = searchClient.initIndex(environment.algolia.indexName);
  config = {
    indexName: environment.algolia.indexName,
    searchClient,
  };

  constructor() {}

  getAlgoliaConfig() {
    return this.config;
  }

  fetchSearchResults(
    searchQuery: string,
    currentPage: number,
    maxItem: number,
    filters: string
  ) {
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
        sellingPrice: product.sellingPrice,
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
    categoryName: string = '',
    cityName: string = '',
    stateName: string = '',
    minPrice: number = 10,
    maxPrice: number = 50000
  ): Observable<ProductModel[]> {
    /* The code is creating a filter string based on the `minPrice`, `maxPrice`, and `categoryName`
    values. */
    let filters = `price:${minPrice} TO ${maxPrice}`;
    if (categoryName) {
      filters += ` AND category.name:${categoryName}`;
    }

    if (cityName) {
      filters += ` AND sellerStores.city:${cityName}`;
    }

    if (stateName) {
      filters += ` AND sellerStores.state:${stateName}`;
    }

    let tempHits: ProductModel[] = [];
    let formattedResults: Observable<ProductModel[]>;
    const searchResults = this.fetchSearchResults(
      searchQuery,
      pageNumber,
      maxItem,
      filters
    );

    /* The code block is a loop that fetches search results from the Algolia index for each page of
    results. */
    for (let firstPage = 0; firstPage < pageNumber + 1; firstPage++) {
      formattedResults = from(searchResults).pipe(
        switchMap((data) => {
          const formattedHits = this.convertToProductModel(data.hits);

          if (pageNumber === 0) {
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
