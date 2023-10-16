import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-buyer-profile',
  templateUrl: './buyer-profile.component.html',
  styleUrls: ['./buyer-profile.component.scss'],
})
export class BuyerProfileComponent implements OnInit, OnDestroy {
  isEditing: boolean = false;
  isEditingSub$: Subscription;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isEditingSub$ = this.userService.isEditingUserInfo.subscribe(
      (status) => (this.isEditing = status)
    );
  }

  onEdit() {
    this.isEditing = !this.isEditing;
    this.userService.isEditingUserInfo.next(this.isEditing);
  }

  ngOnDestroy(): void {
    if (this.isEditingSub$) {
      this.isEditingSub$.unsubscribe();
    }
  }
}
