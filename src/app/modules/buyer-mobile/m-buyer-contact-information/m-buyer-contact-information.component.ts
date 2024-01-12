import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-m-buyer-contact-information',
  templateUrl: './m-buyer-contact-information.component.html',
  styleUrls: ['./m-buyer-contact-information.component.scss'],
})
export class MBuyerContactInformationComponent implements OnInit, OnDestroy {
  isEditingSub$: Subscription;
  isEditing: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isEditingSub$ = this.userService.isEditingUserInfo.subscribe(
      (status) => {
        this.isEditing = status;
        console.log(status);
      }
    );
  }

  ngOnDestroy(): void {
    this.isEditingSub$.unsubscribe();
  }
}
