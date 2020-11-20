import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProductModel } from  "../../../../models/products.model";
import { ProductsService } from "../../../../services/products/products.service";

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Output() deleteProductDetail: EventEmitter<ProductModel> = new EventEmitter();
  productDetails: ProductModel[];

  constructor( private productService: ProductsService) { }

  ngOnInit(): void {
    
    this.productService.getProducts(1, 4).subscribe((productDetail) => {
      this.productDetails = productDetail.data.data
    });
    
  } 

  onEdit(productDetail) {
    console.log('Edit Product')
  }
  
  onDelete(productDetail) {
    this.deleteProductDetail.emit();
  }

}
