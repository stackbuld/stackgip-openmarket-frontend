import { HttpClient } from "@angular/common/http";
import { ApiAppUrlService } from "../api-app-url.service";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { OrderResponce, Order } from "./../../models/order.model";

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

  deleteOrder(userId:string,orderId:number){
    return this.http.delete(
      this.baseUrl+`seller/${userId}/orders/${orderId}`
    );
  }
}
