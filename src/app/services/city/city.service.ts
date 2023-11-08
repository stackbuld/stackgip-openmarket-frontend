import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import algoliasearch from 'algoliasearch';
import { ICityService } from './ICity.interface';
import { Observable, from, of, switchMap } from 'rxjs';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.apiKey
);

@Injectable({
  providedIn: 'root',
})
export class CityService implements ICityService {
  config = {
    indexName: environment.algolia.indexName,
    searchClient,
  };
  index = searchClient.initIndex(this.config.indexName);
  constructor() {}

  getAllCities(): Observable<string[]> {
    const cityResults = this.index.searchForFacetValues(
      'sellerStores.city',
      ''
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
