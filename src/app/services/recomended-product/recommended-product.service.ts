import { Injectable } from '@angular/core';
import {algoliasearch} from 'algoliasearch';
import { Observable, from, switchMap, of } from 'rxjs';
import { RecommendedProduct } from '../../models/products.model';
import { environment } from '../../../environments/environment';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.apiKey
);

@Injectable({
  providedIn: 'root',
})
export class RecommendedProductService {
  // index = searchClient.initIndex(
  //   environment.algolia.indexName.recommendedProducts
  // );
  constructor() {}

  getAllRecommendedProducts(): Observable<RecommendedProduct[]> {
    let searchClientResults = searchClient.search([
      {
        indexName: environment.algolia.indexName.recommendedProducts,
      },
    ]);

    let formattedProducts = from(searchClientResults).pipe(
      switchMap((data) => {
        const hits = data.results.map((category) => {
          return this.convertToRecommendedProductModel(category);
        });
        return of(hits);
      })
    );

    return formattedProducts;
  }

  convertToRecommendedProductModel(product: any): RecommendedProduct {
    const convertedProduct: RecommendedProduct = {
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
