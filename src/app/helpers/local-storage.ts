import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn : 'root'
})
export class AppLocalStorage {
    cartCount: BehaviorSubject<any> = new BehaviorSubject('');
    currentUser: BehaviorSubject<any> = new BehaviorSubject('');
    messageSource: BehaviorSubject<any> = new BehaviorSubject('');
    productViewed: BehaviorSubject<any> = new BehaviorSubject('');

    constructor() {}

    public storeToStorage = (key, value) => {
        localStorage.setItem(key, btoa(unescape(encodeURIComponent(JSON.stringify(value)))))
    }

    public getFromStorage = (key) => {
        try {
            return JSON.parse(atob(localStorage.getItem(key)))
        } catch (error) {
            return null
        }
    }

    public isStoredInSession = (key) => {
        return localStorage.getItem(key) ? true : false
    }

    public removeFromStorage = (key) => {
        localStorage.removeItem(key);
    }

    public getAccessToken = () => {
        return localStorage.getItem('xs_access_token')
    }
}