import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  SellerBaseResponse,
  SellerStores,
  StoreAvailability,
} from 'src/app/models/StoreModels';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SellerStoreService {
  private baseUrl = environment.storeApi;
  private sellerStores: SellerStores[] = [];
  private sellerStoresListener = new Subject<SellerStores[]>();
  days: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  storeAvailabilities: StoreAvailability[] = [];
  storeAvailabilitiesSubj = new Subject<StoreAvailability[]>();

  constructor(private http: HttpClient) {}

  getSellerstores(userId) {
    this.http
      .get<SellerBaseResponse<SellerStores[]>>(
        `${this.baseUrl}sellerstores/stores/user/${userId}`
      )
      .subscribe((res) => {
        this.sellerStores = res.data;
        this.sellerStoresListener.next(this.sellerStores);
      });

    return this.sellerStoresListener.asObservable();
  }

  createSellerStore(sellerStore) {
    return this.http.post(`${this.baseUrl}sellerStores`, sellerStore);
  }

  updateSellerStore(sellerStore) {
    return this.http.put(
      `${this.baseUrl}sellerStores?storeId=${sellerStore.id}`,
      sellerStore
    );
  }

  deleteSellerStore(sellerStore) {
    return this.http.delete(`${this.baseUrl}sellerStores/${sellerStore.id}`);
  }

  getTimes() {
    const times = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        const minute = j === 0 ? '00' : `${j}`;
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  }

  getMainTime(dateObj: Date) {
    const dateObject = new Date(dateObj);

    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
  }

  convertTo24Hours(oldTime: string) {
    const [time, period] = oldTime.split(' ');
    const [hour, minute] = time.split(':');
    let formattedHour = parseInt(hour);

    if (period === 'PM') {
      formattedHour += 12;
    }

    return `${formattedHour}:${minute}`;
  }

  addAvailability(arr: StoreAvailability[]) {
    arr.forEach((availability) => {
      if (
        availability.openingTime !== null &&
        availability.closingTime !== null
      ) {
        this.storeAvailabilities = this.storeAvailabilities.filter(
          (avail) => avail.dayOfWeek != availability.dayOfWeek
        );

        this.storeAvailabilities.push(availability);

        this.storeAvailabilitiesSubj.next(this.storeAvailabilities);
      }
    });
  }
}
