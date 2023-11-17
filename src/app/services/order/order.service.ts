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
import * as moment from 'moment';
import { isObject } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orderActionTaken = new Subject<boolean>();

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

  formatDate(date: string) {
    const inputDate = new Date(date);

    const localDate = new Date(
      inputDate.getTime() - inputDate.getTimezoneOffset() * 60000
    );

    const options: any = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = localDate.toLocaleDateString('en-US', options);

    return formattedDate;
  }

  formatDateToISO(date: string, time: string) {
    const combinedString = `${date} ${time}`;
    const isoString = moment(
      combinedString,
      'MMM DD, YYYY HH:mm'
    ).toISOString();

    const momentObj = moment.utc(isoString).local();

    const actualDate = momentObj.format('YYYY-MM-DD');
    const actualTime = momentObj.format('HH:mm:ss');

    console.log(`Actual Date: ${actualDate}, Actual Time: ${actualTime}`);

    return isoString;
  }

  getDateAndTime(rawDateString: string) {
    const dateString = rawDateString;
    const momentObj = moment(
      dateString,
      'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (Z)'
    );

    const actualDate = momentObj.format('DD-MM-YYYY');
    const actualTime = momentObj.format('HH:mm:ss');

    return {
      actualDate,
      actualTime,
    };
  }

  getCurrentDate() {
    const options: any = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    };

    const today = new Date();
    const formattedDate = today.toLocaleString('en-US', options);
    return formattedDate;
  }

  getMaxDate(currentDate: Date) {
    const dateString = currentDate;
    const originalDate = new Date(dateString);

    // Add two days
    const newDate = new Date(originalDate);
    newDate.setDate(originalDate.getDate() + 2);

    const dayOfWeek = newDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      newDate.setDate(newDate.getDate() + 2); // Add two more days if it's a weekend
    }

    return newDate;
  }
}
