import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit {
  cart: any ;
  cartItems: any[] = [];
  user = null;
  referenceId = null;
  paymentMethods: any[] = [];
  paymentMethod = null;
  loadingPaymentMethods: boolean;
  loadingUnitUpdate: boolean;
  loadingPayment: boolean;
  loadingCart: boolean;
  selectedCartItem: any;
  deletingCartItem: boolean;

  constructor(
    private productService: ProductsService,
    private toastService: ToastrService,
    private applocal: AppLocalStorage,
  ) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    this.user = JSON.parse(localStorage.getItem('user'));
    this.referenceId = localStorage.getItem('referenceId');

    if ((this.referenceId !== null) || this.user !== null) {
      this.getCustomerCart();
      this.getPaymentMethods();
    }
  }

  getCustomerCart = () => {
    this.loadingCart = true;
    let productService$;
    if (this.user !== null) {
      const payload = {
        key: 'user',
        id: this.user.id
      }
      productService$ = this.productService.getCart(payload);
    } else {
      const payload = {
        key: 'reference',
        id: this.referenceId
      }
      productService$ = this.productService.getCart(payload);
    }
    
    productService$.subscribe((res) => {
        if (res.status === 'success') {
          this.cart = res.data;
          this.cartItems = res.data.cartItems;
          this.applocal.cartCount.next(res.data.cartItems.length + 1);
          this.applocal.storeToStorage('cartCount', res.data.cartItems.length + 1);
          this.toastService.success(res.message, 'SUCCESS');
          this.loadingCart = false;
        } else {
          this.loadingCart = false;
          this.toastService.warning(res.message, 'MESSAGE');
        }
      }, (error) => {
        this.loadingCart = false;
        this.toastService.error(error.message, 'ERROR');
    });
  }

  setSelectedCartItem = (item: any) => {
    this.selectedCartItem = item;
  }

  closeDeleteDialog = () => {
    document.getElementById('closeDeleteCartModalDialog').click();
  }

  deleteCartItem = () => {
    this.deletingCartItem = true;
    let productService$;
    if (this.user !== null) {
      const payload = {
        key: 'user',
        id: this.user.id,
        productId: this.selectedCartItem.product.id
      }
      productService$ = this.productService.deleteCartItem(payload);
    } else {
      const payload = {
        key: 'reference',
        id: this.referenceId,
        productId: this.selectedCartItem.product.id
      }
      productService$ = this.productService.deleteCartItem(payload);
    }
    productService$.subscribe((res) => {
      if (res.status === 'success') {
        this.deletingCartItem = false;
        this.toastService.success(res.message, 'SUCCESS');
        this.closeDeleteDialog();
        this.getCustomerCart();
      } else {
        this.deletingCartItem = false;
        this.toastService.error(res.message, 'ERROR');
      }
      }, error => {
        this.deletingCartItem = false;
        this.toastService.error(error.message, 'ERROR');
    });
  }

  getPaymentMethods = () => {
    this.loadingPaymentMethods = true;
    const productService$ = this.productService.getPaymentMethods();
    productService$.subscribe((res) => {
        if (res.status === 'success') {
          this.paymentMethods = res.data;
          this.loadingPaymentMethods = false;
        } else {
          this.loadingPaymentMethods = false;
          this.toastService.error(res.message, 'ERROR')
        }
      }, error => {
        this.loadingPaymentMethods = false;
        this.toastService.warning(error.message, 'ERROR')
    });
  }

  updateUnit = (payload: any) => {
    this.loadingUnitUpdate = true;
    const productService$ = this.productService.updateCartItemUnit(payload);
    productService$.subscribe((res) => {
        if (res.status === 'success') {
          this.loadingUnitUpdate = false;
          this.cart = res.data;
          this.cartItems = res.data.cartItems;
          this.applocal.cartCount.next(res.data.cartItems.length + 1);
          this.applocal.storeToStorage('cartCount', res.data.cartItems.length + 1);
          this.toastService.success(res.message, 'SUCCESS');
        } else {
          this.loadingUnitUpdate = false;
          this.toastService.error(res.message, 'ERROR');
        }
      }, error => {
        this.loadingUnitUpdate = false;
        this.toastService.error(error.message, 'ERROR');
    });
  }

  updateItemUnit = (key, unit, productId) => {
    if (key === 'plus') {
      unit++;
      const payload = {
        userId: this.user ? this.user.id : '',
        referenceId: this.referenceId,
        productId: productId,
        unit: unit
      }
      this.updateUnit(payload);
    }

    if (key === 'minus') {
      if(unit > 1) {
        unit--
        const payload = {
          userId: this.user ? this.user.id : '',
          referenceId: this.referenceId,
          productId: productId,
          unit: unit
        }
        this.updateUnit(payload);
      }
    } 
  }

  setPaymentMethod = (item: any) => {
    this.paymentMethod = item;
  }

  makePayment = () => {
    if(this.cartItems.length > 0) {
      if(this.paymentMethod === null) {
        this.toastService.warning('Kindly select a payment method', 'MESSAGE');
      } else {
        if (this.user !== null) {
          this.loadingPayment = true;
          const payload = {
            userId: this.user.id,
            referenceId: this.referenceId,
            currencyCode: "NGN",
            paymentProviderCode: this.paymentMethod.code
          }
          const productService$ = this.productService.makePayment(payload);
          productService$.subscribe((res) => {
              if (res.status === 'success') {
                window.open(res.data.redirectUrl);
                this.loadingPayment = false;
              } else {
                this.loadingPayment = false;
                this.toastService.error(res.message, 'ERROR');
              }
            }, error => {
              this.loadingPayment = false;
              this.toastService.warning(error.message, 'ERROR');
          });
        } else {
          this.toastService.warning('Please login to make payment', 'MESSAGE');
        }
      }
    } else {
      this.toastService.warning('No Item(s) in Cart', 'MESSAGE');
    }
  }

}
