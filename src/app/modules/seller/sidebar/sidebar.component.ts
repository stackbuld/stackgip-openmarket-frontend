import { Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { IUser } from '../../../models/IUserModel';
import { SellerService } from '../../../services/seller/seller.service';
import { DOCUMENT } from '@angular/common';
import { AppLocalStorage } from '../../../helpers/local-storage';
import { MatDialog } from '@angular/material/dialog';
import { LogoutModalComponent } from '../../../shared/components/logout-modal/logout-modal.component';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-seller-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: false
})
export class SellerSidebarComponent implements OnInit {
  loggedInUser: IUser;
  seoDomain = environment.seoDomain;

  constructor(
    private router: Router,
    private appLocal: AppLocalStorage,
    private sellerS: SellerService,
    @Inject(DOCUMENT) private document: Document,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.sellerS.loggedInUser;
  }

  onLogout() {
    this.dialog.open(LogoutModalComponent, {
      position: { top: '40px' },
    });
  }
}
