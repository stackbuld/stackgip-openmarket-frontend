import { HttpClient } from "@angular/common/http";
import { ApiAppUrlService } from "../api-app-url.service";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { OrderResponce, Order, OrderApiModel,OrderStatus } from "./../../models/order.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl:string = "";
  constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {
    this.baseUrl = apiUrls.ecommerceBaseUrl;
  }

  public getPrice(orders:Order[]):string{
    return orders.reduce((t,i)=>t+(i.price*i.unit),0)
      .toFixed(2).toLocaleString();
  }

  getNewOrders(userId:string,pageNumber: number = 1,maxItem = 50): 
  Observable<OrderResponce>{
    return this.http.get<OrderResponce>(
      this.baseUrl + `seller/${userId}/orders/new/?
      pageNumber=${pageNumber}&maxItem=${maxItem}`
    );
  }

  getOrdersByStatus(
    userId:string,status:string,
    pageNumber:number = 1,maxItem = 50
  ):Observable<OrderApiModel>{
    return this.http.get<OrderApiModel>(
      `${this.baseUrl}seller/${userId}/orders/${status}/?
      pageNumber=${pageNumber}&maxItem=${maxItem}`
    );
  }

  UpdateStatus(
    orderId:string,orderStatus:OrderStatus
  ):Observable<OrderResponce>{
    return this.http.put<OrderResponce>(
      `${this.baseUrl}seller/orders/${orderId}/status`,orderStatus 
      // `${this.baseUrl}seller/orders/${orderId}/status/${status}`,[] 
    );
  }
}
