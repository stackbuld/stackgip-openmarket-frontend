import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import { IProductPage, ProductModel } from '../../models/products.model';
import { ISearchService } from './iSearchService.interface';
import {
  Observable,
  from,
  of,
  switchMap,
  Subject,
  BehaviorSubject,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SearchQueryModel } from 'src/app/models/query-params.model';
import { tap } from 'rxjs/operators';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.apiKey,
);

@Injectable({
  providedIn: 'root',
})
export class SearchService implements ISearchService {
  numberOfItems = new BehaviorSubject<number>(0);
  index: SearchIndex = searchClient.initIndex(
    environment.algolia.indexName.products,
  );
  config = {
    indexName: environment.algolia.indexName.products,
    searchClient,
  };
  filterChanged = new Subject<boolean>();

  constructor(private route: ActivatedRoute) {}

  getAlgoliaConfig() {
    return this.config;
  }

  fetchSearchResults(
    searchQuery: string,
    currentPage: number,
    maxItem: number,
    filters: string,
  ) {
    return this.index.search(searchQuery, {
      hitsPerPage: maxItem,
      page: currentPage,
      filters,
      // facets: ['*'],
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
          imageUrl: product.category.imageUrl,
        },
        categoryId: product.categoryId,
        createdOn: product.createdOn,
        description: product.description,
        id: product.id,
        imageUrl: product.imageUrl,
        paymentOptions: product.paymentOptions,
        productImages: product.productImages,
        unit: product.unit,
        userId: product.userId,
        videoUrls: product.videoUrls,
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
    maxItem: number = 30,
    searchQuery: string = '',
    storefrontSellerId: string = '',
    category: string = '',
    city: string = '',
    state: string = '',
    minPrice: number = 1,
    maxPrice: number = 500000,
  ): Observable<ProductModel[]> {
    let filters = `price:${minPrice} TO ${maxPrice}`;

    if (category) {
      filters += ` AND category.name:"${category}"`;
    }

    if (city) {
      filters += ` AND sellerStores.city:"${city}"`;
    }

    if (state) {
      filters += ` AND sellerStores.state:"${state}"`;
    }

    if (storefrontSellerId) {
      filters += ` AND userId:${storefrontSellerId}`;
    }

    if (filters !== `price:${minPrice} TO ${maxPrice}`) {
      this.filterChanged.next(true);
    }

    let tempHits: ProductModel[] = [];
    let formattedResults: Observable<ProductModel[]>;
    const searchResults = this.fetchSearchResults(
      searchQuery,
      pageNumber,
      maxItem,
      filters,
    );
    /* The code block is a loop that fetches search results from the Algolia index for each page of
    results. */
    for (let firstPage = 0; firstPage < pageNumber + 1; firstPage++) {
      formattedResults = from(searchResults).pipe(
        tap((data) => {
          this.numberOfItems.next(data.nbHits);
        }),
        switchMap((data) => {
          const formattedHits = this.convertToProductModel(data.hits);

          if (pageNumber === 0) {
            tempHits = formattedHits;
          } else {
            tempHits = [...tempHits, ...formattedHits];
          }
          return of(tempHits);
        }),
      );
    }
    return formattedResults;
  }

  getQueryParams(): SearchQueryModel {
    const queryParams: SearchQueryModel = {
      category: '',
      state: '',
      city: '',
      maxPrice: '500000',
      minPrice: '1',
    };
    this.route.queryParams.subscribe({
      next: (params) => {
        queryParams.category = params.category || queryParams.category;
        queryParams.state = params.state || queryParams.state;
        queryParams.city = params.city || queryParams.city;
        queryParams.maxPrice = params.maxPrice || queryParams.maxPrice;
        queryParams.minPrice = params.minPrice || queryParams.minPrice;
      },
      error: (err) => {},
      complete: () => {
        return queryParams;
      },
    });

    return queryParams;
  }
}
