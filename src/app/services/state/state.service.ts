import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import algoliasearch from 'algoliasearch';
import { IStateService } from './IState.interface';
import { Observable, from, of, switchMap } from 'rxjs';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.apiKey
);

const facetToRetrieve = 'sellerStores.state';
const filterAttribute = 'userId';

@Injectable({
  providedIn: 'root',
})
export class StateService implements IStateService {
  index = searchClient.initIndex(environment.algolia.indexName);
  config = {
    indexName: environment.algolia.indexName,
    searchClient,
  };

  constructor() {}

  getAllStates(storefrontSellerId: string): Observable<string[]> {
    const stateResults = this.index.searchForFacetValues(facetToRetrieve, '', {
      facetFilters: [[`${filterAttribute}:${storefrontSellerId}`]],
    });

    let tempStates: string[] = [];

    let formattedStates = from(stateResults).pipe(
      switchMap((data) => {
        const facetHits = data.facetHits;
        tempStates = facetHits.map((hits) => hits.value);
        return of(tempStates);
      })
    );

    return formattedStates;
  }

  searchStates(
    searchItem: string,
    storefrontSellerId: string
  ): Observable<string[]> {
    const stateResults = this.index.searchForFacetValues(
      facetToRetrieve,
      searchItem,
      {
        facetFilters: [[`${filterAttribute}:${storefrontSellerId}`]],
      }
    );
    let tempStates: string[] = [];

    let formattedStates = from(stateResults).pipe(
      switchMap((data) => {
        const facetHits = data.facetHits;
        tempStates = facetHits.map((hits) => hits.value);
        return of(tempStates);
      })
    );

    return formattedStates;
  }
}
