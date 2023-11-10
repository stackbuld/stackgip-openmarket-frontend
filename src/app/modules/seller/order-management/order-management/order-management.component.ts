import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
})
export class OrderManagementComponent implements OnInit, OnDestroy {
  cancelledTab = false;
  confirmedTab = false;
  newTab = false;
  allTab = false;

  user: any;
  totalItemCount: number;
  maximumItem: number = 10;
  defaultPage: number = 1;
  pageNumber: number;
  sellerId: string = '';
  buyerId: string = '';
  paymentReferenceId: string = '';
  type: string = '';
  startDate: string = '';
  endDate: string = '';
  dateType: string = 'all';
  orderStatus: string = '';
  deliveryStatus: string = '';
  paymentStatus: string = '';
  search: string = '';
  isCustomDate: boolean;
  loadingOrders: boolean;
  orders: any[] = [];
  overviewData: any;
  loadingOverviewData: boolean;
  orderActionTaken$: Subscription;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private appLocal: AppLocalStorage,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.switchTabs('newTab');
    this.user = this.authService.getLoggedInUser();
    this.sellerId = this.user.id;
    this.getDashbardOverview();

    this.orderActionTaken$ = this.orderService.orderActionTaken.subscribe(
      (status) => {
        if (status) {
          this.fetchAllOrders(this.defaultPage);
        }
      }
    );
  }

  getDashbardOverview = () => {
    this.loadingOverviewData = true;
    this.orderService.getOrderDashboardOverview(this.sellerId).subscribe(
      (res) => {
        this.overviewData = res.data;
        this.loadingOverviewData = false;
      },
      (error) => {
        this.loadingOverviewData = false;
      }
    );
  };

  viewOrder(item: any) {
    this.appLocal.messageSource.next(item);
    this.router.navigate([`seller/orders/detail/${item.id}`]);
  }

  filterOrders = (e: any) => {
    if (e.target.value === 'custom') {
      this.isCustomDate = true;
      this.dateType = e.target.value;
    } else {
      this.isCustomDate = false;
      this.startDate = '';
      this.endDate = '';
      this.dateType = e.target.value;
      this.fetchAllOrders(this.defaultPage);
    }
  };

  searchOrders = () => {
    this.fetchAllOrders(this.defaultPage);
  };

  customFilter = () => {
    if (this.startDate !== '' && this.endDate !== '') {
      this.fetchAllOrders(this.defaultPage);
    } else {
      this.toastr.warning('Both start and end date are required', 'HINT');
    }
  };

  clear = () => {
    this.isCustomDate = false;
    let searchInput = document.getElementById(
      'searchInput'
    ) as HTMLInputElement;
    let selectElement = document.getElementById(
      'filterSelect'
    ) as HTMLSelectElement;
    searchInput.value = '';
    selectElement.value = 'all';
    this.startDate = '';
    this.endDate = '';
    this.dateType = 'all';
    this.orderStatus = '';
    this.search = '';
    this.switchTabs('newTab');
  };

  fetchAllOrders = (pageNumber: any) => {
    this.loadingOrders = true;
    this.orders = [];
    this.orderService
      .fetchAllOrders(
        pageNumber,
        this.maximumItem,
        this.sellerId,
        this.buyerId,
        this.paymentReferenceId,
        this.type,
        this.startDate,
        this.endDate,
        this.dateType,
        this.orderStatus,
        this.deliveryStatus,
        this.paymentStatus,
        this.search
      )
      .subscribe(
        (res) => {
          console.log(res.data);

          this.orders = res.data.data;
          this.pageNumber = res.data.pager.pageNumber;
          this.totalItemCount = res.data.pager.totalItemCount;
          this.loadingOrders = false;
        },
        (error) => {
          this.loadingOrders = false;
        }
      );
  };

  switchTabs = (key: string) => {
    if (key === 'allTab') {
      this.orderStatus = '';
      this.allTab = true;
      this.newTab = false;
      this.cancelledTab = false;
      this.confirmedTab = false;
      this.fetchAllOrders(this.defaultPage);
    }

    if (key === 'newTab') {
      this.orderStatus = 'pending,notset';
      this.allTab = false;
      this.newTab = true;
      this.cancelledTab = false;
      this.confirmedTab = false;
      this.fetchAllOrders(this.defaultPage);
    }

    if (key === 'cancelledTab') {
      this.orderStatus = 'rejected,returned';
      this.allTab = false;
      this.newTab = false;
      this.cancelledTab = true;
      this.confirmedTab = false;
      this.fetchAllOrders(this.defaultPage);
    }

    if (key === 'confirmedTab') {
      this.orderStatus = 'confirmed';
      this.allTab = false;
      this.newTab = false;
      this.cancelledTab = false;
      this.confirmedTab = true;
      this.fetchAllOrders(this.defaultPage);
    }
  };

  ngOnDestroy(): void {
    if (this.orderActionTaken$) {
      this.orderActionTaken$.unsubscribe();
    }
  }
}
