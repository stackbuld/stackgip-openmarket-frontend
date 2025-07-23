import { Observable } from 'rxjs';
import { RecommendedProduct } from '../../models/products.model';

export interface IRecommendedProductService {
  getAllRecommendedProducts(): Observable<RecommendedProduct[]>;
}
