import { Component, OnInit } from '@angular/core';
// import * as instantsearch from 'instantsearch.js'
// import algoliasearch from 'algoliasearch/lite'

// const searchClient = algoliasearch(
//   'B1G2GM9NG0',
//   'aadef574be1f9252bb48d4ea09b5cfe5'
// );

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  searh: any;

  // config: {
  //   apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  //   appId: 'latency',
  //   indexName: 'instant_search',
  //   routing: true
  // }

  ngOnInit(): void {
    // this.searh = instantsearch(this.config);
  }

  // config = {
  //   indexName: 'demo_ecommerce',
  //   searchClient
  // };
  

}
