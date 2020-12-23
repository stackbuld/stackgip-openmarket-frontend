import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { getLoggedInUser } from "src/app/helpers/userUtility";
import { OrderService } from "../../../../services/order/order.service";
import { OrderDetail } from "../../../../models/order.model";
import { OrderViewMoreComponent } from './../order-view-more/order-view-more.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  @ViewChild('orderViewMore') orderViewMore: OrderViewMoreComponent;
  @Input() status:string;
  user = getLoggedInUser();
  // firstOrderCount:number = 0;
  public orderList:OrderDetail[];


  constructor(public orderService:OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrdersByStatus(this.user.id,this.status).subscribe((o)=>{
      // this.firstOrderCount = o.data.shift().orders.length;
      this.orderList = o.data;
    });
    // this.orderService.getNewOrders(this.user.id).subscribe((o)=>{
    //   this.firstOrderCount = o.data.shift().orders.length;
    //   this.orderList = o.data;
    // });
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
}
