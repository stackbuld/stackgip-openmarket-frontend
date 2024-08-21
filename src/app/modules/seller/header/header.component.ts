import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { IUser } from "src/app/models/IUserModel";
import { SellerService } from 'src/app/services/seller/seller.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seller-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class SellerHeaderComponent implements OnInit {
  loggedInUser: IUser;
  currentRoute: string = "";
  seoDomain = environment.seoDomain;

  constructor(
    private sellerS: SellerService,
    private router: Router
  ) { 
    this.currentRoute = router.url; 
  }

  ngOnInit(): void {
    this.loggedInUser = this.sellerS.loggedInUser;
  }

}
