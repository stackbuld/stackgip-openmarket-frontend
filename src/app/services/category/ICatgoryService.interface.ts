import { Observable } from 'rxjs';
import { ICategory } from '../../models/CategoryModels';

export interface ICatgoryService {
  getAllCategories(): Observable<string[]>;
}
