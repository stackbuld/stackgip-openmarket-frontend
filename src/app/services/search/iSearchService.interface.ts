import {Observable} from 'rxjs';
import {IProductPage, ProductsApiModel} from '../../models/products.model';

export interface  ISearchService{

  // @ts-ignore
  getProducts(pageNumber: number = 1, maxItem = 50, search = '', categoryId = '', minPrice = 10, maxPrice = 500000): Observable<IProductPage>

}
