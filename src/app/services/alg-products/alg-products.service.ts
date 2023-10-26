import { Injectable } from '@angular/core';
import algoliasearch from "algoliasearch";
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

  getAlgoliaConfig() {
    return this.config;
  }

  runAlgoliaSearch(searchQuery: string) {
    const index = searchClient.initIndex(this.config.indexName);
    return index.search(searchQuery);
  }
}
