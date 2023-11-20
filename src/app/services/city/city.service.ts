import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import { ICityService } from './ICity.interface';
import { Observable, from, of, switchMap } from 'rxjs';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.apiKey
);

const facetToRetrieve = 'sellerStores.city';
const filterAttribute = 'userId';

@Injectable({
  providedIn: 'root',
})
export class CityService implements ICityService {
  index: SearchIndex = searchClient.initIndex(environment.algolia.indexName);
  config = {
    indexName: environment.algolia.indexName,
    searchClient,
  };
  constructor() {}

  getAllCities(storefrontSellerId): Observable<string[]> {
    const cityResults = this.index.searchForFacetValues(facetToRetrieve, '', {
      facetFilters: [[`${filterAttribute}:${storefrontSellerId}`]],
    });

    let tempCities: string[] = [];

    let formattedCities = from(cityResults).pipe(
      switchMap((data) => {
        const facetHits = data.facetHits;
        tempCities = facetHits.map((hits) => hits.value);
        return of(tempCities);
      })
    );

    return formattedCities;
  }

  searchCities(
    searchItem: string,
    storefrontSellerId: string
  ): Observable<string[]> {
    const cityResults = this.index.searchForFacetValues(
      facetToRetrieve,
      searchItem,
      {
        facetFilters: [[`${filterAttribute}:${storefrontSellerId}`]],
      }
    );

    let tempCities: string[] = [];

    let formattedCities = from(cityResults).pipe(
      switchMap((data) => {
        const facetHits = data.facetHits;
        tempCities = facetHits.map((hits) => hits.value);
        return of(tempCities);
      })
    );

    return formattedCities;
  }
}
