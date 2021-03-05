import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  isSellerApproved: boolean = false;
  openModal: boolean = false;
  routeData$: Subscription;
  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.routeData$ = this.route.data.subscribe(
      res => {
        this.isSellerApproved = get(res, 'data', false);
        this.openModal = !this.isSellerApproved;
      }
    );
  }
  modalStatus(d: any) {
    if (d) {
      console.log('clicked');
      this.openModal = false;
      this.router.navigate(['/']);
    }
  }
  ngOnDestroy(): void {
    this.routeData$.unsubscribe();
  }

}
