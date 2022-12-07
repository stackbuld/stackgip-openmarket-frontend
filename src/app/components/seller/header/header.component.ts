import { Component, OnInit } from '@angular/core';
import { IUser } from "src/app/models/IUserModel";
import { SellerService } from 'src/app/services/seller/seller.service';

@Component({
  selector: 'app-seller-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class SellerHeaderComponent implements OnInit {
  loggedInUser: IUser;

  constructor(
    private sellerS: SellerService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.sellerS.loggedInUser;
  }

}
