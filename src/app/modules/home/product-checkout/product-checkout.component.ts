import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit {
  count = 1;

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

  }

  increaseQuantity = () => {
    this.count++;
  }

  decreaseQuantity = () => {
    if(this.count > 1) {
      this.count--
    }
  }

}
