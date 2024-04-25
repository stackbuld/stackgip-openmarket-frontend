import { Observable } from 'rxjs';
import { ICategory } from '../../models/CategoryModels';

export interface ICatgoryService {
  getAllCategories(storefrontSellerId?: string): Observable<string[]>;
  getAllStorefrontCategories(): Observable<ICategory[]>;
}
