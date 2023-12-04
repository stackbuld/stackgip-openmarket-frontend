import { Observable } from 'rxjs';
import { IProductPage, ProductModel } from '../../models/products.model';

export interface ISearchService {
  getAllProducts(
    pageNumber: number,
    maxItem: number,
    searchQuery: string,
    storefrontSellerId: string,
    category: string,
    city: string,
    state: string,
    minPrice: number,
    maxPrice: number
  ): Observable<ProductModel[]>;
}
