import { Component, OnInit } from '@angular/core';
import { Order } from './../../../../models/order.model';
import { formatDate } from './../../../../helpers/date-format';

@Component({
  selector: 'app-order-view-more',
  templateUrl: './order-view-more.component.html',
  styleUrls: ['./order-view-more.component.css']
})
export class OrderViewMoreComponent implements OnInit {
  order:Order;
  formatDate:Function;

  constructor() {
    this.formatDate = formatDate;
  }

  ngOnInit(): void {}

  setOrder({order}):void{
    this.order = order;
  }

}
