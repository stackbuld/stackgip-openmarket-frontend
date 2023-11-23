import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISeller } from 'src/app/models/sellerModel';
import { HttpClient } from '@angular/common/http';
import { ISellerService } from './ISellerStorefront.interface';
@Injectable({
  providedIn: 'root',
})
export class SellerStorefrontService implements ISellerService {
  constructor(private http: HttpClient) {}

  getSellerStorefrontDetails(sellerId: string): Observable<{ data: ISeller }> {
    return this.http.get<{ data: ISeller }>(
      environment.sellerStorefrontApi + `/${sellerId}`
    );
  }
}
// export class SellerStorefrontService implement ISellerService {
//   constructor(private http: HttpClient) {}

// getSellerStorefrontDetails(sellerId: string): Observable<any> {
//   return this.http.get<any>(
//     environment.sellerStorefrontApi + `/${sellerId}`
//   );
// }
