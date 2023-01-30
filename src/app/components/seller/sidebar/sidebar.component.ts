import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IUser } from "src/app/models/IUserModel";
import { SellerService } from 'src/app/services/seller/seller.service';

@Component({
  selector: 'app-seller-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SellerSidebarComponent implements OnInit {
  loggedInUser: IUser;

  constructor(
    private router: Router,
    private sellerS: SellerService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.sellerS.loggedInUser;
  }

  cancel = () => {
    document.getElementById('closeLogoutModalBtn').click();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.cancel();
  }

}
