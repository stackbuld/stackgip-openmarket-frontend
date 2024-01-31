import {Injectable} from '@angular/core';
import {google} from 'google-maps';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DeliveryAddressService {
    deliveryAddress = new BehaviorSubject<any>(null);

    constructor() {
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setCurrentLocation(
                    position.coords.latitude,
                    position.coords.longitude
                );
            });
        }
    }

    setCurrentLocation(latitude: number, longitude: number) {
        try {
            const geocoder = new google.maps.Geocoder();
            const latLng = new google.maps.LatLng(latitude, longitude);

            geocoder.geocode({location: latLng}, (results, status) => {
                if (status === 'OK' && results[0]) {
                    this.deliveryAddress.next(results[0]);
                    const address = results[0].formatted_address;
                }
            });
        } catch {
        }
    }
}
