import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, fromEvent, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order/order.service';

enum Tabs {
  All = 'allTab',
  New = 'newTab',
  Cancelled = 'cancelledTab',
  Confirmed = 'confirmedTab',
  InTransit = 'inTransitTab',
  Delivered = 'delivered',
  Delivering = 'delivering',
  AwaitingPickup = 'awaitingPickup',
  InTransitAll = 'inTransitAll',
}

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
})
export class OrderManagementComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  cancelledTab = false;
  confirmedTab = false;
  newTab = false;
  allTab = false;
  inTransitTab: boolean = false;
  delivered: boolean = false;
  delivering: boolean = false;
  awaitingPickup: boolean = false;
  inTransitAll: boolean = false;

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
  @ViewChild('orderSearch', { static: true }) searchQuery: ElementRef;
  orderDeliveryStatus: string[] = ['Delivered', 'Pending', 'Cancelled'];
  allFilterInput: FormControl;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private appLocal: AppLocalStorage,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.allFilterInput = new FormControl(null);
    this.allFilterInput.valueChanges.subscribe((value) => {
      if (value) {
        this.deliveryStatus = value;
        this.fetchAllOrders(this.defaultPage);
      }
    });
    this.switchTabs('newTab');
    this.user = this.authService.getLoggedInUser();
    this.sellerId = this.user.id;
    this.getDashboardOverview();

    this.orderActionTaken$ = this.orderService.orderActionTaken.subscribe(
      (status) => {
        if (status) {
          this.fetchAllOrders(this.defaultPage);
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.getSearch();
  }

  getDashboardOverview = () => {
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

  getSearch() {
    fromEvent(this.searchQuery.nativeElement, 'keyup')
      .pipe(
        tap(() => {
          this.loadingOrders = true;
        }),
        filter(Boolean),
        debounceTime(300),
        distinctUntilChanged(),
        map((data) => this.searchQuery.nativeElement.value.toLowerCase())
      )
      .subscribe((searchTerm) => {
        this.fetchAllOrders(this.defaultPage);
      });
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
    if (this.search !== '') {
      console.log(this.search);

      this.fetchAllOrders(this.defaultPage);
    }
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

  fetchAllOrders = (pageNumber: number) => {
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
      .subscribe({
        next: (res) => {
          this.orders = res.data.data;
          this.pageNumber = res.data.pager.pageNumber;
          this.totalItemCount = res.data.pager.totalItemCount;
          this.loadingOrders = false;
        },
        error: (error) => {
          this.loadingOrders = false;
        },
      });
  };

  setTabs(activeTab: string): void {
    Object.keys(Tabs).forEach((tab) => {
      this[Tabs[tab]] = false;
    });

    if (
      activeTab == Tabs.Delivered ||
      activeTab == Tabs.Delivering ||
      activeTab == Tabs.AwaitingPickup ||
      activeTab == Tabs.InTransitAll
    ) {
      this.inTransitTab = true;
    } else if (activeTab == Tabs.InTransit) {
      this.inTransitAll = true;
    }

    this[activeTab] = true;
  }

  switchTabs = (key: string) => {
    switch (key) {
      case Tabs.All:
        this.orderStatus = '';
        this.setTabs(Tabs.All);
        this.fetchAllOrders(this.defaultPage);
        break;
      case Tabs.New:
        this.orderStatus = 'pending,notset';
        this.setTabs(Tabs.New);
        this.fetchAllOrders(this.defaultPage);
        break;
      case Tabs.Cancelled:
        this.orderStatus = 'rejected,returned';
        this.setTabs(Tabs.Cancelled);
        this.fetchAllOrders(this.defaultPage);
        break;
      case Tabs.Confirmed:
        this.orderStatus = 'confirmed';
        this.setTabs(Tabs.Confirmed);
        this.fetchAllOrders(this.defaultPage);
        break;
      case Tabs.InTransit:
        this.orderStatus = '';
        this.deliveryStatus = '';
        this.setTabs(Tabs.InTransit);
        this.fetchAllOrders(this.defaultPage);
        break;
      case Tabs.AwaitingPickup:
        this.orderStatus = '';
        this.deliveryStatus = 'assignedForPickup';
        this.setTabs(Tabs.AwaitingPickup);
        this.fetchAllOrders(this.defaultPage);
        break;
      case Tabs.Delivering:
        this.orderStatus = '';
        this.deliveryStatus = 'pickedUpFromStore ' || 'assignedForDelivery';
        this.setTabs(Tabs.Delivering);
        this.fetchAllOrders(this.defaultPage);
        break;
      case Tabs.Delivered:
        this.orderStatus = '';
        this.deliveryStatus = Tabs.Delivered;
        this.setTabs(Tabs.Delivered);
        this.fetchAllOrders(this.defaultPage);
        break;
      case Tabs.InTransitAll:
        this.orderStatus = '';
        this.deliveryStatus = '';
        this.setTabs(Tabs.InTransitAll);
        this.fetchAllOrders(this.defaultPage);
    }
  };

  ngOnDestroy(): void {
    if (this.orderActionTaken$) {
      this.orderActionTaken$.unsubscribe();
    }
  }
}
