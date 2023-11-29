import { Observable } from 'rxjs';
import { PromotedProduct } from '../../models/products.model';

export interface IPromotedProductService {
  getAllPromotedProducts(): Observable<PromotedProduct[]>;
}
