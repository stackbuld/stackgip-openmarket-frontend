import { Injectable } from '@angular/core';
import { IPromotedProductService } from './IPromotedProductService.interface';
import { PromotedProduct } from '../../models/products.model';
import { environment } from 'src/environments/environment';
import algoliasearch from 'algoliasearch';
import { Observable, from, of, switchMap } from 'rxjs';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.apiKey
);

@Injectable({
  providedIn: 'root',
})
export class PromotedProductsService implements IPromotedProductService {
  index = searchClient.initIndex(
    environment.algolia.indexName.promotedProducts
  );

  constructor() {}

  getAllPromotedProducts(): Observable<PromotedProduct[]> {
    let searchClientResults = this.index.search('');

    let formattedProducts = from(searchClientResults).pipe(
      switchMap((data) => {
        const hits = data.hits.map((category) => {
          return this.convertToPromotedProductModel(category);
        });
        return of(hits);
      })
    );

    return formattedProducts;
  }

  convertToPromotedProductModel(product: any): PromotedProduct {
    const convertedProduct: PromotedProduct = {
      name: product.name,
      price: product.price,
      sellingPrice: product.sellingPrice,
      previousPrice: product.previousPrice,
      description: product.description,
      categoryId: product.categoryId,
      category: {
        name: product.category.name,
        description: product.category.description,
        imageUrl: product.category.imageUrl,
        id: product.category.id,
        createdOn: product.category.createdOn,
      },
      imageUrl: product.imageUrl,
      imageUrls: product.imageUrls,
      unit: product.unit,
      weight: product.weight,
      userId: product.userId,
      paymentOptions: product.paymentOptions,
      productImages: product.productImages,
      productOptions: product.productOptions,
      sellerStores: product.sellerStores,
      id: product.id,
      createdOn: product.createdOn,
    };

    return convertedProduct;
  }
}
