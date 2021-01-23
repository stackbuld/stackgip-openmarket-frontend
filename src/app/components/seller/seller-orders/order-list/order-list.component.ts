import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef} from '@angular/core';
import { getLoggedInUser } from "src/app/helpers/userUtility";
import { OrderService } from "../../../../services/order/order.service";
import { OrderDetail } from "../../../../models/order.model";
import { OrderViewMoreComponent } from './../order-view-more/order-view-more.component';
import { UserService } from './../../../../services/user/user.service';
import { UpdateDeliveryStatusComponent } from './../update-delivery-status/update-delivery-status.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  @ViewChildren(OrderViewMoreComponent) orderViewMores: QueryList<OrderViewMoreComponent>
  @ViewChildren(UpdateDeliveryStatusComponent) updateDeliveries: QueryList<UpdateDeliveryStatusComponent>
  @ViewChildren('closeUpdateStatus') closeUpdateStatus: QueryList<ElementRef>
  @Input() status:string;
  user = getLoggedInUser();
  public orderList:OrderDetail[]; 
  pageNumber: number;
  totalItemCount: number;
  maximumItem: number = 4;

  constructor(public orderService:OrderService,public userService:UserService) { }

  ngOnInit(): void {
    this.orderService.getOrdersByStatus(this.user.id,this.status).subscribe((o)=>{
      this.fetchCurrentOrders(1);
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

  setOrder({order}):void{
    const orderViewMore:OrderViewMoreComponent = this.orderViewMores
      .find((item)=>{
        return item.type == this.status
      });
    orderViewMore.setOrder({order});
  }

  setOrderId({orderId,status}):void{
    const updateDelivery:UpdateDeliveryStatusComponent = this.updateDeliveries
      .find((item)=>{
        return item.type == this.status
      });
    updateDelivery.setOrderId({orderId,status});
  }

  closeUpdateStatusModal():void{
    const closeBtnEle:ElementRef = this.closeUpdateStatus.find((ele)=>{
      return ele.nativeElement.getAttribute('data-status') == this.status;
    });
    closeBtnEle.nativeElement.click();
  }

  fetchCurrentOrders(pageNumber:number){
    this.orderService.getOrdersByStatus(this.user.id,this.status,pageNumber,this.maximumItem)
      .subscribe((o)=>{
        let oList:OrderDetail[] = o.data.data
        oList.map((o)=>{
          o.user$ = this.userService.getUserById(o.userId);
          return o;
        });
        this.orderList = oList;
        this.pageNumber = o.data.pager.pageNumber;
        this.totalItemCount = o.data.pager.totalItemCount;
      },error => console.error(error));
  }
}
