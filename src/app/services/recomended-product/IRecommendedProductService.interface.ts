import { Observable } from 'rxjs';
import { RecommendedProduct } from 'src/app/models/products.model';

export interface IRecommendedProductService {
  getAllRecommendedProducts(): Observable<RecommendedProduct[]>;
}
