import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { AuthService } from 'src/app/services/auth.service';
import { FooterService } from 'src/app/services/footer.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  all = true;
  success = false;

  user: any;
  totalItemCount: number;
  maximumItem: number = 10;
  defaultPage:number = 1;
  pageNumber: number;
  buyerId:string = "";
  paymentReferenceId: string = '';
  type: string = '';
  dateType: string = 'all';
  orderStatus: string = '';
  deliveryStatus: string = '';
  paymentStatus: string = '';
  loadingOrders: boolean;
  orders: any[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private appLocal: AppLocalStorage,
    private footerService: FooterService,
  ) {}

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.footerService.setShowFooter(true);
    this.user = this.authService.getLoggedInUser();
    this.buyerId = this.user.id;

    this.fetchAllOrders(this.defaultPage);
  }

  viewOrder(item: any) {
		this.appLocal.messageSource.next(item);
    this.router.navigate([`homepage/details/${item.id}`]);
	}

  fetchAllOrders = (pageNumber:any) => {
    this.loadingOrders = true;
    this.orders = [];
    this.orderService.fetchAllOrders(
      pageNumber, this.maximumItem, '', this.buyerId,
      this.paymentReferenceId, this.type, '', '',
      this.dateType, this.orderStatus, this.deliveryStatus, this.paymentStatus, ''
    ).subscribe((res) => {
        this.orders = res.data.data;
        this.pageNumber = res.data.pager.pageNumber;
        this.totalItemCount = res.data.pager.totalItemCount;
        this.loadingOrders = false;
      }, error => {
        this.loadingOrders = false;
      });
  }

  switchTabs = (key: string) => {
    if (key === 'all') {
      this.deliveryStatus = '';
      this.all = true;
      this.success = false;
      this.fetchAllOrders(this.defaultPage);
    }

    if (key === 'success') {
      this.deliveryStatus = 'delivered';
      this.all = false;
      this.success = true;
      this.fetchAllOrders(this.defaultPage);
    }
  }
}
