import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  isFetching: Observable<boolean>;
  constructor(
    private productSearchService: ProductSearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchResults = this.productSearchService.searchResults;
    this.isFetching = this.productSearchService.isFetching;
  }

  getImageResolution = (url: string, width: number, height: number) => {
    return ImageResolutionUtility.getImageResolution(url, width, height);
  };

  onLoadProduct(id: string) {
    this.productSearchService.isSearching.next(false);
    this.productSearchService.clearSearchInput.next(true);
    this.router.navigate(['/seller/products/view/', id]);
  }
}
