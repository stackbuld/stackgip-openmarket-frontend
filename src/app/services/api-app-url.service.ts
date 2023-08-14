import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiAppUrlService {
  public baseApiUrl = environment.identityApi;
  public ecommerceBaseUrl = environment.ecommerceApi;
  public walletBaseUrl = environment.walletApi;
  public storeBaseUrl = environment.storeApi;
  public notificationBaseUrl = environment.notificationApi;
  constructor() {}
}
