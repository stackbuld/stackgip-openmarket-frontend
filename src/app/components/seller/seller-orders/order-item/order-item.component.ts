import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import uikit from 'uikit';
import { Order } from "../../../../models/order.model";
import { ToastrService } from 'src/app/services/toastr.service';
import { OrderService } from './../../../../services/order/order.service';
import { getLoggedInUser } from './../../../../helpers/userUtility';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {
  @Input() items:Order[];
  @Output() viewedMore = new EventEmitter();
  user = getLoggedInUser();

  constructor(
    private toast: ToastrService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {}

  onDelete(orderId:number):void{
    uikit.modal.confirm(
      'Are you sure that you want to remove this ?'
    ).then(()=>{
        this.orderService.deleteOrder(this.user.id,orderId).subscribe((a)=>{
          this.items = this.items.filter(
            (o) => o.id !== orderId
          );
        });
        this.toast.success("order removed successfully");
      },()=>{});
  }

  setViewMore(order:Order){
    this.viewedMore.emit({order});
  }
}
