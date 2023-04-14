import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SellerBaseResponse, SellerStores } from 'src/app/models/StoreModels';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerStoreService {
  private baseUrl = environment.storeApi
  private sellerStores: SellerStores[] = []
  private sellerStoresListener = new Subject<SellerStores[]>()


  constructor(
    private http: HttpClient
  ) { }

  getSellerstores(userId) {
    this.http.get<SellerBaseResponse<SellerStores[]>>(`${this.baseUrl}sellerstores/stores/user/${userId}`)
    .subscribe((res) => {
      this.sellerStores = res.data
      this.sellerStoresListener.next(this.sellerStores)
    })

    return this.sellerStoresListener.asObservable()
  }

  createSellerStore(sellerStore) {
    return this.http.post(`${this.baseUrl}sellerStores`, sellerStore)

  }

  updateSellerStore(sellerStore) {
    return this.http.put(`${this.baseUrl}sellerStores?storeId=${sellerStore.id}`, sellerStore)
  }

  deleteSellerStore(sellerStore) {
    return this.http.delete(`${this.baseUrl}sellerStores/${sellerStore.id}`)
  }
}
