import { Component, OnInit, Input } from '@angular/core';
import { OrderDetail } from "../../../../models/order.model";
import { OrderService } from "../../../../services/order/order.service";
import { formatDate } from './../../../../helpers/date-format';
import { IUser } from 'src/app/models/IUserModel';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  @Input() order:OrderDetail;
  @Input() user:IUser;
  formatDate:Function;

  constructor(public orderSservice:OrderService) {
    this.formatDate = formatDate;
  }

  ngOnInit(): void {}
}
