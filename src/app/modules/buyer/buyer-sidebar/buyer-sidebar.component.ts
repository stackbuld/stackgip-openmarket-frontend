import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/IUserModel';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { LogoutModalComponent } from '../../../shared/components/logout-modal/logout-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-buyer-sidebar',
  templateUrl: './buyer-sidebar.component.html',
  styleUrls: ['./buyer-sidebar.component.scss'],
})
export class BuyerSidebarComponent implements OnInit, OnDestroy {
  isPersonalOpened: boolean = true;
  isSettingsOpened: boolean = true;
  userId: string;
  user: IUser;
  defaultImgUrl: string = 'assets/image/default-profile-picture-3.png';
  profileImgUrl: string;
  isFetching: boolean = false;
  profileUpdatedSub$: Subscription;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.userId = this.authService.getLoggedInUser().id;

    this.profileUpdatedSub$ = this.userService.userProfileUpdated.subscribe(
      (status) => {
        this.userService.getUserById(this.userId).subscribe({
          next: (user) => {
            this.isFetching = false;
            this.user = user.data.user;
            user.data.user.profileImageUrl
              ? (this.profileImgUrl = user.data.user.profileImageUrl)
              : (this.profileImgUrl = this.defaultImgUrl);
          },
          error: (err) => {
            this.isFetching = false;
          },
        });
      },
    );
  }

  onTogglePersonal(type: string) {
    if (type == 'information') {
      this.isPersonalOpened = !this.isPersonalOpened;
    }
    if (type == 'settings') {
      this.isSettingsOpened = !this.isSettingsOpened;
    }
  }

  onLogout() {
    this.dialog.open(LogoutModalComponent, {
      position: { top: '40px' },
    });
  }

  ngOnDestroy(): void {
    this.profileUpdatedSub$.unsubscribe();
  }
}
