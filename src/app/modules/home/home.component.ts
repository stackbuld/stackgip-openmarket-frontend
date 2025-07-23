import { Component, OnInit } from '@angular/core';
import { IUser } from '../../models/IUserModel';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements OnInit {
  constructor(
    private userService: UserService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user: IUser = this.authService.getLoggedInUser();

    if (user) {
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

      this.cartService.getPaymentMethods().subscribe();
    }
  }
}
