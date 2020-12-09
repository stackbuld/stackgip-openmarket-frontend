import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { getLoggedInUser } from "src/app/helpers/userUtility";
import { OrderService } from "../../../services/order/order.service";
import { OrderDetail } from "../../../models/order.model";
import { OrderViewMoreComponent } from './order-view-more/order-view-more.component';

@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {
  @ViewChild('orderViewMore') orderViewMore: OrderViewMoreComponent;
  user = getLoggedInUser();
  firstOrderCount:number = 0;
  public orderList:OrderDetail[];


  constructor(public orderService:OrderService) { }

  ngOnInit(): void {
    this.orderService.getNewOrders(this.user.id).subscribe((o)=>{
      this.firstOrderCount = o.data.shift().orders.length;
      this.orderList = o.data;
    });
  }

  viewMore(orderId:number):void{
    this.orderList = this.orderList.map((o)=>{
      o.viewMore = o.id === orderId?true:false;
      return o;
    });
  }

  viewItems():void{
    this.orderList = this.orderList.map((o)=>{
      o.viewMore = false;
      return o;
    }); 
  }
  
  // setViewMore({order}){
  //   console.log(this.orderViewMore as ViewMoreComponent)
  //   // this.orderViewMore.setOrder({order});
  // }
}
