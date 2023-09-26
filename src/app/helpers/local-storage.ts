import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/IUserModel';


@Injectable({
    providedIn : 'root'
})
export class AppLocalStorage {
    cartCount: BehaviorSubject<number> = new BehaviorSubject(0);
    currentUser: BehaviorSubject<IUser> = new BehaviorSubject(null);
    messageSource: BehaviorSubject<any> = new BehaviorSubject('');
    productViewed: BehaviorSubject<string> = new BehaviorSubject('');

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