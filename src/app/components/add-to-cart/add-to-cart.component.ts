import { Component, OnInit, Input } from '@angular/core';
import { EditProductModel } from './../../models/products.model';
import { formatDate } from './../../helpers/date-format';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit {
  @Input() product:EditProductModel;
  formatDate:Function

  constructor() { this.formatDate = formatDate}

  ngOnInit(): void {
    // console.log(this.product)
  }

}
