import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
})
export class OrderManagementComponent implements OnInit {
  private user: any;
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  constructor() {}

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.getOrders();
  }

  getOrders() {
    this.orderService
      .getOrdersByStatus(this.user.id, 'paid')
      .subscribe((data) => {
        console.log(data);
      });
  }
}
