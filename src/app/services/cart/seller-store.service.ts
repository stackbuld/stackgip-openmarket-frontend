import { Injectable } from '@angular/core';
import { log } from 'console';
import { SellerStores } from 'src/app/models/StoreModels';

@Injectable({ providedIn: 'root' })
export class SellerStoreLocationService {
  distance: number;

  constructor() {}

  getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c; // Distance in km

    return distance;
  }

  deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  findClosestStore(
    userLocation: { lat: number; lng: number },
    storeLocations: SellerStores[],
  ) {
    return storeLocations.reduce(
      (closest, store) => {
        const distance = this.getDistanceFromLatLonInKm(
          userLocation.lat,
          userLocation.lng,
          store.lat,
          store.lng,
        );

        return closest.distance < distance ? closest : { ...store, distance };
      },
      { distance: Number.MAX_VALUE },
    );
  }
}
