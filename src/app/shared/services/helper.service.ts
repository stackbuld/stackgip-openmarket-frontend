import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  getLoggedInUserId() {
    return localStorage.getItem('userId');
  }
}
