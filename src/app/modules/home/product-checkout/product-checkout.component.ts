import { CartPaymentMethod } from './../../../services/cart/model/cart-payment-model';
import { IUser } from 'src/app/models/IUserModel';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { ProductsService } from 'src/app/services/products/products.service';
import { CartService } from '../../../services/cart/cart.service';
import {
  CartData,
  CartItem,
  GetCartResponseModel,
} from '../../../services/cart/model/get-cart.model';
import { Observable } from 'rxjs';
import { WindowRefService } from '../../../shared/services/window.service';
import { FooterService } from 'src/app/services/footer.service';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs/operators';
import uikit from 'uikit';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss'],
})
export class ProductCheckoutComponent implements OnInit {
  cart: CartData;
  cartItems: CartItem[] = [];
  user: IUser = null;
  referenceId: string = '';
  paymentMethods: CartPaymentMethod[] = [];
  paymentMethod!: CartPaymentMethod;
  loadingPaymentMethods: boolean;
  loadingUnitUpdate: boolean;
  loadingPayment: boolean;
  loadingCart: boolean;
  selectedCartItem: any;
  deletingCartItem: boolean;
  isUpdatingUnit: boolean[] = [];
  panelOpenState: boolean[] = [];
  productId: string;
  variations: any[] = [];
  cartItemStockUnit: { [key: string]: number };

  constructor(
    private footerService: FooterService,
    private cartService: CartService,
    private toastService: ToastrService,
    private applocal: AppLocalStorage,
    private windowService: WindowRefService,
    private authService: AuthService,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.footerService.setShowFooter(true);
    this.init();

    this.paymentMethods = JSON.parse(localStorage.getItem('paymentMethods')!);

    if (!this.paymentMethods) {
      this.cartService.getPaymentMethods().subscribe((res) => {
        this.paymentMethods = res.data;
        localStorage.setItem('paymentMethods', JSON.stringify(res.data));
      });
    }
  }

  init() {
    this.user = JSON.parse(localStorage.getItem('user') as string);
    this.referenceId = this.authService.getUserReferenceNumber();

    if (this.referenceId !== null || this.user !== null) {
      this.getCustomerCart();
    }
  }
  getCustomerCart() {
    this.loadingCart = true;
    let cart$: Observable<GetCartResponseModel>;
    const userId = this.user?.id ?? '';
    const reference = this.referenceId ?? '';

    cart$ = this.cartService.getCart(userId, reference);

    cart$.pipe(take(1)).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cart = res.data;

          this.cartItems = res.data.cartItems;

          const variations: any[] = [];
          let productItem: { [key: string]: number } = {};
          this.cartItems.forEach((item) => {
            if (item.varations.length > 0) {
              variations.push(item.varations);
            }
            try {
              this.productService
                .getCachedProductById(item.productId)
                .subscribe((product) => {
                  productItem[product?.data?.id] = product.data.unit;
                });
            } catch {}
          });

          this.cartItemStockUnit = productItem;

          this.setVariation(variations);

          this.applocal.cartCount.next(res.data.cartItems.length + 1);
          this.applocal.storeToStorage(
            'cartCount',
            res.data.cartItems.length + 1
          );
          this.toastService.success(res.message, 'SUCCESS');
          this.loadingCart = false;
        } else {
          this.loadingCart = false;
          this.toastService.warning(res.message, 'MESSAGE');
        }
      },
      error: (error) => {
        this.loadingCart = false;
        this.toastService.error(error.message, 'ERROR');
      },
    });
  }

  setVariation(list: any) {
    list.forEach((variation) => {
      const groupedOptions = variation.reduce((acc, option) => {
        const title = option.title;
        const existingOptions = acc[title] || [];

        return {
          ...acc,
          [title]: [...existingOptions, option],
        };
      }, {});

      const groupedOptionsArray = Object.values(groupedOptions);
      this.variations.push(groupedOptionsArray);
    });

    // this.sortedVariationsList = groupedOptionsArray;
  }

  setSelectedCartItem = (item: any) => {
    this.selectedCartItem = item;
  };

  closeDeleteDialog = () => {
    uikit.modal('#delete-cart-modal').hide();
  };

  deleteCartItem = () => {
    this.deletingCartItem = true;
    let payload;
    if (this.user !== null) {
      payload = {
        key: 'user',
        id: this.user.id,
        productId: this.selectedCartItem.product.id,
      };
    } else {
      payload = {
        key: 'reference',
        id: this.referenceId,
        productId: this.selectedCartItem.product.id,
      };
    }
    this.cartService.deleteCartItem(payload).subscribe({
      next: (res) => {
        this.deletingCartItem = false;
        this.toastService.success(res.message, 'SUCCESS');
        this.closeDeleteDialog();
        this.getCustomerCart();
      },
      error: (error) => {
        this.deletingCartItem = false;
        this.toastService.error(error.message, 'ERROR');
      },
    });
  };

  onExpand(index: number) {
    this.panelOpenState[index] = !this.panelOpenState[index];
  }

  updateUnit = (payload: any, index: number) => {
    this.loadingUnitUpdate = true;
    this.isUpdatingUnit[index] = true;

    const productService$ = this.cartService.updateCartItemUnit(payload);
    productService$.subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.isUpdatingUnit[index] = false;
          this.loadingUnitUpdate = false;
          this.cart = res.data;

          this.cartItems = res.data.cartItems;
          this.applocal.cartCount.next(res.data.cartItems.length + 1);
          this.applocal.storeToStorage(
            'cartCount',
            res.data.cartItems.length + 1
          );
          this.toastService.success(res.message, 'SUCCESS');
        } else {
          this.loadingUnitUpdate = false;
          this.toastService.error(res.message, 'ERROR');
        }
      },
      error: (error) => {
        this.loadingUnitUpdate = false;
        this.toastService.error(error.message, 'ERROR');
      },
    });
  };

  updateItemUnit = (
    key: string,
    unit: number,
    productId: string,
    index: number
  ) => {
    this.productId = productId;

    if (key === 'plus') {
      unit++;
    } else if (key === 'minus') {
      unit--;
    }

    const payload = {
      userId: this.user ? this.user.id : '',
      referenceId: this.referenceId,
      productId: productId,
      unit: unit,
    };
    this.updateUnit(payload, index);

    // if (key === 'plus') {
    //   unit++;
    //   const payload = {
    //     userId: this.user ? this.user.id : '',
    //     referenceId: this.referenceId,
    //     productId: productId,
    //     unit: unit,
    //   };
    //   this.updateUnit(payload, index);
    // }

    // if (key === 'minus') {
    //   if (unit > 1) {
    //     unit--;
    //     const payload = {
    //       userId: this.user ? this.user.id : '',
    //       referenceId: this.referenceId,
    //       productId: productId,
    //       unit: unit,
    //     };
    //     this.updateUnit(payload, index);
    //   }
    // }
  };

  setPaymentMethod = (item: any) => {
    this.paymentMethod = item;
  };

  makePayment = () => {
    if (this.cartItems.length > 0) {
      if (!this.paymentMethod) {
        this.toastService.warning('Kindly select a payment method', 'MESSAGE');
      } else {
        if (this.user !== null) {
          this.loadingPayment = true;
          const payload = {
            userId: this.user.id,
            referenceId: this.referenceId,
            currencyCode: 'NGN',
            paymentProviderCode: this.paymentMethod.code,
          };

          this.cartService.makePayment(payload).subscribe({
            next: (res) => {
              if (res.status === 'success') {
                // this.router.navigateByUrl(res.data.redirectUrl);
                this.windowService.nativeWindow.window.open(
                  res.data.redirectUrl
                );
                this.loadingPayment = false;
              } else {
                this.loadingPayment = false;
                this.toastService.error(res.message, 'ERROR');
              }
            },
            error: (error) => {
              this.loadingPayment = false;
              this.toastService.warning(error.message, 'ERROR');
            },
          });
        } else {
          this.authService.showSharedSocialModal();
          this.toastService.warning('Please login to make payment', 'MESSAGE');
        }
      }
    } else {
      this.toastService.warning('No Item(s) in Cart', 'MESSAGE');
    }
  };
}
