import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageResolutionUtility } from 'src/app/helpers/image-resolution.utility';
import { ProductSearchResult } from 'src/app/models/products.model';

import { ProductSearchService } from 'src/app/services/seller/product-search.service';

@Component({
  selector: 'app-seller-product-search',
  templateUrl: './seller-product-search.component.html',
  styleUrls: ['./seller-product-search.component.scss'],
})
export class SellerProductSearchComponent implements OnInit {
  searchResults: Observable<ProductSearchResult[]>;
  isSearching: Observable<boolean>;
  isFetching: Observable<boolean>;
  test: boolean;
  constructor(private productSearchService: ProductSearchService) {}

  ngOnInit(): void {
    this.searchResults = this.productSearchService.searchResults;
    this.isSearching = this.productSearchService.isSearching;
    this.isFetching = this.productSearchService.isFetching;
    this.productSearchService.isFetching.subscribe(
      (value) => (this.test = value)
    );
  }

  getImageResolution = (url: string, width: number, height: number) => {
    return ImageResolutionUtility.getImageResolution(url, width, height);
  };
}
