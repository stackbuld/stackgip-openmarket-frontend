import { HttpClient } from '@angular/common/http';
import { ApiAppUrlService } from '../api-app-url.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  OrderResponce,
  Order,
  OrderApiModel,
  OrderStatus,
} from './../../models/order.model';
import { IApiResponseModel } from 'src/app/models/products.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orderActionTaken = new Subject<boolean>();
  scheduleTime: string[] = [
    '9am - 10am',
    '10am - 11am',
    '11am - 12pm',
    '12pm - 1pm',
    '1pm - 2pm',
    '2pm - 3pm',
    '3pm - 4pm',
  ];

  baseUrl: string = '';
  constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {
    this.baseUrl = apiUrls.ecommerceBaseUrl;
  }

  public getPrice(orders: Order[]): string {
    return orders
      .reduce((t, i) => t + i.price * i.unit, 0)
      .toFixed(2)
      .toLocaleString();
  }

  getNewOrders(
    userId: string,
    pageNumber: number = 1,
    maxItem = 50
  ): Observable<OrderResponce> {
    return this.http.get<OrderResponce>(
      this.baseUrl +
        `seller/${userId}/orders/new/?
      pageNumber=${pageNumber}&maxItem=${maxItem}`
    );
  }

  getOrderDashboardOverview(userId: string): Observable<IApiResponseModel> {
    return this.http.get<IApiResponseModel>(
      this.baseUrl + `seller/${userId}/orders/overview`
    );
  }

  fetchAllOrders(
    pageNumber: number = 1,
    maxItem = 10,
    sellerId = '',
    buyerId = '',
    paymentReferenceId = '',
    type = '',
    startDate = '',
    endDate = '',
    dateType = '',
    orderStatus = '',
    deliveryStatus = '',
    paymentStatus = '',
    search = ''
  ): Observable<OrderApiModel> {
    return this.http.get<OrderApiModel>(
      this.baseUrl +
        `order?pageNumber=${pageNumber}&maxItem=${maxItem}&sellerId=${sellerId}&paymentReferenceId=${paymentReferenceId}&buyerId=${buyerId}&type=${type}&startDate=${startDate}&endDate=${endDate}&dateType=${dateType}&orderStatus=${orderStatus}&deliveryStatus=${deliveryStatus}&paymentStatus=${paymentStatus}&search=${search}`
    );
  }

  getOrdersByStatus(
    userId: string,
    status: string,
    pageNumber: number = 1,
    maxItem = 50
  ): Observable<OrderApiModel> {
    return this.http.get<OrderApiModel>(
      `${this.baseUrl}seller/${userId}/orders/${status}/?
      pageNumber=${pageNumber}&maxItem=${maxItem}`
    );
  }

  acceptRejectOrder(payload): Observable<OrderResponce> {
    return this.http.post<OrderResponce>(
      `${this.baseUrl}order/accept-decline`,
      payload
    );
  }

  UpdateStatus(
    orderId: string,
    orderStatus: OrderStatus
  ): Observable<OrderResponce> {
    return this.http.put<OrderResponce>(
      `${this.baseUrl}seller/orders/${orderId}/status`,
      orderStatus
      // `${this.baseUrl}seller/orders/${orderId}/status/${status}`,[]
    );
  }
}
