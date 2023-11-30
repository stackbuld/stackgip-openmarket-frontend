import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ProductSearchService } from 'src/app/services/seller/product-search.service';
import { SellerService } from 'src/app/services/seller/seller.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // isSellerApproved: boolean = false;
  // routeData$: Subscription;
  // switching: string;
  // approved = this.sellerS.sellerRegisterationFormStatus.approved;
  // pending = this.sellerS.sellerRegisterationFormStatus.pending;
  isSearching: Observable<boolean>;
  isFetching: Observable<boolean>;
  currentRoute: string = 'seller/dashboard';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sellerS: SellerService,
    private productSearchService: ProductSearchService
  ) {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? (this.currentRoute = event.url) : null;
    });
  }

  ngOnInit(): void {
    // this.routeData$ = this.route.data.subscribe((res) => {
    //   this.switching = res.data;
    // });
    this.isSearching = this.productSearchService.isSearching;
    this.isFetching = this.productSearchService.isFetching;
  }

  // modalStatus(d: any) {
  //   if (d.isModalClose) {
  //     if (d.isFormSubmit) {
  //       this.switching = "pending";
  //     } else {
  //       this.router.navigate(["/"]);
  //     }
  //   }
  // }

  ngOnDestroy(): void {
    //   this.routeData$.unsubscribe();
  }
}
