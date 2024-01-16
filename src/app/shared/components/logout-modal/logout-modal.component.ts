import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppLocalStorage } from 'src/app/helpers/local-storage';

@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss'],
})
export class LogoutModalComponent {
  constructor(
    private router: Router,
    private applocal: AppLocalStorage,
    private dialog: MatDialog
  ) {}

  onCancel() {
    this.dialog.closeAll();
  }

  onLogout() {
    localStorage.clear();
    sessionStorage.clear();
    this.applocal.currentUser.next(null);
    this.onCancel();
    this.router.navigate(['/']);
  }
}
