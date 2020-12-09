import { Component, OnInit } from '@angular/core';
import { ProductsService } from './../../../../services/products/products.service';
import { ProductResponse } from 'src/app/models/products.model';
import { Observable } from 'rxjs';
import { formatDate } from './../../../../helpers/date-format';

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.css']
})
export class ViewMoreComponent implements OnInit {
  product$:Observable<ProductResponse>;
  formatDate:Function;

  constructor(private productService:ProductsService) { 
    this.formatDate = formatDate;
  }

  ngOnInit(): void {}

  setProduct({productId}):void{
    this.product$ = this.productService.getProductById(productId);
  }
}
