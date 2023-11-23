import { Observable } from 'rxjs';
import { IProductPage, ProductModel } from '../../models/products.model';

export interface ISearchService {
  getAllProducts(
    pageNumber: number,
    maxItem: number,
    searchQuery: string,
    categoryName: string,
    cityName: string,
    stateName: string,
    storefrontSellerId: string,
    minPrice: number,
    maxPrice: number
  ): Observable<ProductModel[]>;
}
