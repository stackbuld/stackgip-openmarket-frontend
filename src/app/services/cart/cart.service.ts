import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiAppUrlService } from '../api-app-url.service';
import {
  AddToCartRequestModel,
  AddToCartResponseModel,
  DeleteCartResponseModel,
  UpdateCartUnitRequest,
} from './model/add-cart-model';
import { GetCartResponseModel } from './model/get-cart.model';
import {
  GetCartPaymentMethodResponse,
  MakeCartPaymentRequestModel,
  MakeCartPaymentResponseModel,
} from './model/cart-payment-model';
import {GetShippingPriceEstimateRequest, GetShippingPriceEstimateResponse} from './model/logistic.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl: string;
  constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {
    this.baseUrl = apiUrls.ecommerceBaseUrl;
  }

  getCart(userId: string, referenceId: string): Observable<GetCartResponseModel> {
    return this.http.get<GetCartResponseModel>(
      this.baseUrl + `cart?userId=${userId}&referenceId=${referenceId}`
    );
  }

  deleteCartItem(payload: {
    key: string;
    id: string;
    productId: string;
  }): Observable<DeleteCartResponseModel> {
    if (payload.key === 'user') {
      return this.http.delete<DeleteCartResponseModel>(
        this.baseUrl +
          `cart?userId=${payload.id}&productId=${payload.productId}`
      );
    } else {
      return this.http.delete<DeleteCartResponseModel>(
        this.baseUrl +
          `cart?referenceId=${payload.id}&productId=${payload.productId}`
      );
    }
  }

  getPaymentMethods(): Observable<GetCartPaymentMethodResponse> {
    return this.http.get<GetCartPaymentMethodResponse>(
      this.baseUrl + `cart/payment-methods`
    );
  }

  makePayment(
    payload: MakeCartPaymentRequestModel
  ): Observable<MakeCartPaymentResponseModel> {
    return this.http.post<MakeCartPaymentResponseModel>(
      this.baseUrl + `cart/pay`,
      payload
    );
  }

  updateCartItemUnit(
    payload: UpdateCartUnitRequest
  ): Observable<GetCartResponseModel> {
    return this.http.put<GetCartResponseModel>(
      this.baseUrl + `cart/update-unit`,
      payload
    );
  }

  addToCart(
    payload: AddToCartRequestModel
  ): Observable<AddToCartResponseModel> {
    return this.http.post<AddToCartResponseModel>(
      this.baseUrl + `cart`,
      payload
    );
  }


  createAddress(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}useraddress`, payload);
  }

  fetchUserAddresses(userId: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}useraddress/users/${userId}`);
  }

  setDefaultAddress(payload: any, id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}useraddress/${id}`, payload);
  }

  deleteAddress(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}useraddress/${id}`);
  }

  getShippingEstimate(payload: GetShippingPriceEstimateRequest): Observable<GetShippingPriceEstimateResponse> {
    return this.http.post<GetShippingPriceEstimateResponse>(`${this.baseUrl}shipping/price-estimates`, payload);
  }
}
