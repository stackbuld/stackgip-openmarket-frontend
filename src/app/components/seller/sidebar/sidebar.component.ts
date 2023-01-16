import { Component, OnInit } from '@angular/core';
import { IUser } from "src/app/models/IUserModel";
import { SellerService } from 'src/app/services/seller/seller.service';

@Component({
  selector: 'app-seller-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SellerSidebarComponent implements OnInit {
  logout() {
    throw new Error('Method not implemented.');
  }
  loggedInUser: IUser;

  constructor(
    private sellerS: SellerService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.sellerS.loggedInUser;
  }

}
