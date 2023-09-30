import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { SellerService } from 'src/app/services/seller/seller.service';

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss'],
})
export class ProfileDashboardComponent implements OnInit {
  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {}
}
