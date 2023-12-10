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
  defaultAvailability: StoreAvailability[] = [
    {
      dayOfWeek: 'Monday',
      openingTime: '09:00',
      closingTime: '18:00',
    },

    {
      dayOfWeek: 'Thursday',
      openingTime: '10:00',
      closingTime: '17:00',
    },
    {
      dayOfWeek: 'Saturday',
      openingTime: '11:00',
      closingTime: '17:00',
    },
  ];
  storeAvailabilitiesSubj = new Subject<any>();

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

  updateSellerStore(sellerStore, id: string) {
    return this.http.put(
      `${this.baseUrl}sellerStores?storeId=${id}`,
      sellerStore
    );
  }

  deleteSellerStore(sellerStore) {
    return this.http.delete(`${this.baseUrl}sellerStores/${sellerStore.id}`);
  }

  convertTo24Hours(oldTime: string) {
    const [time, period] = oldTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    let newHours = hours;

    if (!period) {
      return oldTime;
    }
    if (period.toLowerCase() === 'pm' && hours !== 12) {
      newHours += 12;
    } else if (period.toLowerCase() === 'am' && hours === 12) {
      newHours = 0;
    }

    const formattedHours = String(newHours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }

  mergeAvailabilities(existingAvailability, newAvailability) {
    newAvailability.forEach((newObj) => {
      const index = existingAvailability.findIndex(
        (existingObj) => existingObj.dayOfWeek === newObj.dayOfWeek
      );

      if (index !== -1) {
        if (newObj.openingTime !== null && newObj.closingTime !== null) {
          existingAvailability[index].openingTime = newObj.openingTime;
          existingAvailability[index].closingTime = newObj.closingTime;
        }
      }
    });

    return existingAvailability;
  }

  formatStoreAvailability(availability: StoreAvailability[]) {
    return availability.filter((availability) => {
      if (
        availability.openingTime != null &&
        availability.closingTime != null
      ) {
        availability.openingTime = this.convertTo24Hours(
          availability.openingTime
        );

        availability.closingTime = this.convertTo24Hours(
          availability.closingTime
        );
        return availability;
      }
      return;
      console.log(availability);
    });

    return availability;
  }
}
