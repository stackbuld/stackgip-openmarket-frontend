import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-buyer-profile',
  templateUrl: './buyer-profile.component.html',
  styleUrls: ['./buyer-profile.component.scss'],
})
export class BuyerProfileComponent implements OnInit {
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
}
