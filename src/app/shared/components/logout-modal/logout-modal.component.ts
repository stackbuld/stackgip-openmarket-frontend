import {Component, inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AppLocalStorage} from 'src/app/helpers/local-storage';
import {AuthService} from "../../../services/auth.service";
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-logout-modal',
    templateUrl: './logout-modal.component.html',
    styleUrls: ['./logout-modal.component.scss'],
})
export class LogoutModalComponent {
    private windowRef = inject(DOCUMENT).defaultView;

    constructor(
        private applocal: AppLocalStorage,
        private dialog: MatDialog,
        private authService: AuthService
    ) {
    }
    
    onCancel() {
        this.dialog.closeAll();
    }

    onLogout() {
        this.authService.Logout();
        this.authService.isLogin.next(false)
        this.applocal.currentUser.next(null);
        this.onCancel();
        this.windowRef.open(`${environment.seoDomain}`, '_self');
    }
}
