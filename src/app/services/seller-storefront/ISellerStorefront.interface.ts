import { Observable } from 'rxjs';
import { ISeller } from '../../models/sellerModel';

export interface ISellerService {
  getSellerStorefrontDetails(sellerId: string): Observable<{ data: ISeller }>;
}
