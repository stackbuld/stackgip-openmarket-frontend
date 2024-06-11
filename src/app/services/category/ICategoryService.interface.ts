import { Observable } from 'rxjs';
import { ICategory } from '../../models/CategoryModels';

export interface ICategoryService {
  getAllCategories(storefrontSellerId?: string): Observable<string[]>;
  getAllStorefrontCategories(): Observable<ICategory[]>;
}
