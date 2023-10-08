import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss'],
})
export class BuyerComponent implements OnInit {
  userId: string;
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUser().id;

    // this.userService.getUserById(this.userId).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
  }
}
