import { ToastrService } from 'src/app/services/toastr.service';
import {
  ProductModel,
  Category,
  ProductCartModel,
} from '../../../../models/products.model';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { AddToCart } from 'src/app/reducers/action/cart.actions';
import { numberWithCommas } from '../../../../helpers/number-format';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css'],
})
export class SingleProductComponent implements OnInit {
  constructor(private toast: ToastrService, private store: Store<AppState>) {}
  @ViewChild('closeAddToCart') closeAddToCart: ElementRef<HTMLElement>;
  @Input() product;
  numberWithCommas: Function = numberWithCommas;
  ngOnInit(): void {}

  addToCart(productItem) {
    const {
      product,
      orderedUnit,
      shipmentOption,
      productOptions,
      paymentOption,
    } = productItem;
    const productCart: ProductCartModel = {
      category: product.category,
      categoryId: product.categoryId,
      unit: product.unit,
      createdOn: product.createdOn,
      name: product.name,
      paymentOptions: product.paymentOption,
      description: '',
      id: product.id,
      imageUrl: product.imageUrl,
      orderedUnit: orderedUnit,
      slug: product?.slug,
      previousPrice: product.previousPrice,
      price: product.price,
      sellingPrice: product.sellingPrice,
      productImages: product.productImages,
      userId: product.userId,
      videoUrl: product.videoUrl,
      videoUrls: product.videoUrls,
      shipmentOption,
      productOptions,
      paymentOption,
    };
    this.store.dispatch(AddToCart(productCart));
    this.toast.success('product added to cart');
    this.closeAddToCartModal();
  }

  closeAddToCartModal(): void {
    this.closeAddToCart.nativeElement.click();
  }
}
