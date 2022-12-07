import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IUser } from "src/app/models/IUserModel";
import { SellerService } from 'src/app/services/seller/seller.service';

@Component({
  selector: 'app-seller-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class SellerHeaderComponent implements OnInit {
  loggedInUser: IUser;
  currentRoute!: string;

  constructor(
    private sellerS: SellerService,
    private router: Router
  ) { 
    router.events.subscribe((event) => { event instanceof NavigationEnd ?
      this.currentRoute = event.url : null 
    });
  }

  ngOnInit(): void {
    this.loggedInUser = this.sellerS.loggedInUser;
  }

}
