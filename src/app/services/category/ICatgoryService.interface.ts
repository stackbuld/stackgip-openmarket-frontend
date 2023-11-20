import { Observable } from 'rxjs';
import { ICategory } from '../../models/CategoryModels';

export interface ICatgoryService {
  getAllCategories(storefrontSellerId: string): Observable<string[]>;
  searchCategories(
    searchItem: string,
    storefrontSellerId: string
  ): Observable<string[]>;
}
