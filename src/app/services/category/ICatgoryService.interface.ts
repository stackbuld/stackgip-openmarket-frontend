import { Observable } from 'rxjs';
import { ICategory } from '../../models/CategoryModels';

export interface ICatgoryService {
  getAllCategories(): Observable<string[]>;
  searchCategories(searchItem: string): Observable<string[]>;
}
