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

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl: string;
  constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {
    this.baseUrl = apiUrls.ecommerceBaseUrl;
  }

  getCart(payload: {
    key: string;
    id: string;
  }): Observable<GetCartResponseModel> {
    if (payload.key === 'user') {
      return this.http.get<GetCartResponseModel>(
        this.baseUrl + `cart?userId=${payload.id}`
      );
    } else {
      return this.http.get<GetCartResponseModel>(
        this.baseUrl + `cart?referenceId=${payload.id}`
      );
    }
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
}
