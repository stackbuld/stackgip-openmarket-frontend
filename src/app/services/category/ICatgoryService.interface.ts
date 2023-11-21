import { Observable } from 'rxjs';
import { ICategory } from '../../models/CategoryModels';

export interface ICatgoryService {
  getAllCategories(searchItem?: string): Observable<ICategory[]>;
  getAllSellerStorefrontCategories(categoryId: string): Observable<ICategory[]>;
}
