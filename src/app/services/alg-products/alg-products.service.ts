import { Injectable } from '@angular/core';
import { algoliasearch } from "algoliasearch";
import { environment } from 'src/environments/environment';

const searchClient = algoliasearch(environment.algolia.appId, environment.algolia.apiKey);

@Injectable({
  providedIn: 'root'
})
export class AlgProductsService {
  config = {
    indexName: environment.algolia.indexName,
    searchClient,
  };

  constructor() { }

  runAlgolia() {
    return this.config;
  }

  async runAlgoliaSearch(searchQuery: string) {
    const { results } = await searchClient.search({
      requests: [
        {
          indexName: environment.algolia.indexName,
          query: searchQuery,
          facets: ['*'],
          hitsPerPage: 10,
        },
      ],
    });
    console.log(results);
    return results;
  }
}
