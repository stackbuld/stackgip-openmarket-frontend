import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import algoliasearch from 'algoliasearch';
import { IStateService } from './IState.interface';
import { Observable, from, of, switchMap } from 'rxjs';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.apiKey
);

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

  getAllStates(): Observable<string[]> {
    const stateResults = this.index.searchForFacetValues(
      'sellerStores.state',
      ''
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
