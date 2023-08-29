import { Router } from "@angular/router";
import { Component, Inject, OnInit } from "@angular/core";
import { IUser } from "src/app/models/IUserModel";
import { SellerService } from "src/app/services/seller/seller.service";
import { DOCUMENT } from "@angular/common";
import { AppLocalStorage } from "src/app/helpers/local-storage";

@Component({
  selector: "app-seller-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SellerSidebarComponent implements OnInit {
  loggedInUser: IUser;

  constructor(
    private router: Router,
    private appLocal: AppLocalStorage,
    private sellerS: SellerService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.sellerS.loggedInUser;
  }

  cancel = () => {
    this.document.getElementById("closeLogoutModalBtn").click();
  };

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.cancel();
    this.appLocal.currentUser.next(null);
    this.router.navigate(["/auth/login"]);
  }
}
