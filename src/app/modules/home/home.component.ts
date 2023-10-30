import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/IUserModel';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const user: IUser = JSON.parse(localStorage.getItem('user'));

    const userId = user.id;

    this.userService.getUserAddress(userId).subscribe({
      next: (addresses) => {
        localStorage.setItem('userAddress', JSON.stringify(addresses));
        const currentAddress = addresses.find(
          (address) => address.isDefault == true
        );

        if (currentAddress) {
          localStorage.setItem(
            'shippingAddress',
            JSON.stringify(currentAddress)
          );
        } else {
          localStorage.removeItem('shippingAddress');
        }
      },
      error: (err) => {},
    });
  }
}
