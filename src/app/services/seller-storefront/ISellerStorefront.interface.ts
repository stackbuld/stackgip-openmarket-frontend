import { Observable } from 'rxjs';
import { ISeller } from 'src/app/models/sellerModel';

export interface ISellerService {
  getSellerStorefrontDetails(sellerId: string): Observable<ISeller>;
}
