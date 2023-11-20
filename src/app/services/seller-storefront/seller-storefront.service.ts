import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISeller } from 'src/app/models/sellerModel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SellerStorefrontService {
  constructor(private http: HttpClient) {}

  getSellerStorefrontDetails(sellerId: string): Observable<ISeller> {
    return this.http.get<ISeller>(
      environment.sellerStorefrontApi + `/${sellerId}`
    );
  }
}
