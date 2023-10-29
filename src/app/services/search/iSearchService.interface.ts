import { Observable } from 'rxjs';
import { IProductPage } from '../../models/products.model';

export interface  ISearchService{
  getProducts(pageNumber: number, maxItem: number, searchQuery: string, categoryId: string, minPrice: number, maxPrice: number): Observable<IProductPage>
}

