import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SellerService } from 'src/app/services/seller/seller.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  isSellerApproved: boolean = false;
  routeData$: Subscription;
  switching: string;
  approved = this.sellerS.sellerRegisterationFormStatus.approved;
  pending = this.sellerS.sellerRegisterationFormStatus.pending;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sellerS: SellerService,
  ) { }
  ngOnInit(): void {
    this.routeData$ = this.route.data.subscribe(
      res => {
        this.switching = res.data;
        console.log(this.switching);
      }
    );
  }
  modalStatus(d: any) {
    if (d.isModalClose) {
      this.router.navigate(['/']);
    }
  }
  ngOnDestroy(): void {
    this.routeData$.unsubscribe();
  }

}
