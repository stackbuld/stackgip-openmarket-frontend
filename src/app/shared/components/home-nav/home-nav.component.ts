import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { CatgoryService } from 'src/app/services/category/catgory.service';
import { ProductsService } from 'src/app/services/products/products.service';
import algoliasearch from 'algoliasearch';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CartService } from '../../../services/cart/cart.service';
import { IUser } from 'src/app/models/IUserModel';
import { AuthService } from '../../../services/auth.service';
import { WindowRefService } from '../../services/window.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss'],
})
export class HomeNavComponent implements OnInit {
  config = this.searchService.getAlgoliaConfig();
  isSearch = false;
  categories: any;
  cartCount = 0;
  user: IUser;
  referenceId: any;

  constructor(
    private categoryService: CatgoryService,
    private appLocalStorage: AppLocalStorage,
    // private productService: ProductsService,
    private cartService: CartService,
    private toastService: ToastrService,
    private router: Router,
    private applocal: AppLocalStorage,
    private authService: AuthService,
    private windowService: WindowRefService,
    private searchService: SearchService
  ) {
    // this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {
    this.cartService.cartCount.subscribe((count) => {
      this.cartCount = count;
    });
    this.referenceId = this.authService.getUserReferenceNumber();
    this.appLocalStorage.currentUser.subscribe((res) => {
      if (res) {
        this.user = res;
      } else {
        this.user = JSON.parse(localStorage.getItem('user'));
      }
    });
    this.appLocalStorage.productViewed.subscribe((res) => {
      this.isSearch = false;
    });
    this.fetchCategories();
    if (this.referenceId !== null || this.user !== null) {
      this.getCustomerCart();
    }
    this.appLocalStorage.cartCount.subscribe((res) => {
      if (res) {
        let it = res - 1;
        this.cartCount = it === -1 ? 0 : it;
      } else {
        let it = this.appLocalStorage.getFromStorage('cartCount') - 1;
        this.cartCount = it === -1 ? 0 : it;
      }
    });
  }

  closeSidebar = () => {
    this.windowService.nativeWindow.document
      .getElementById('closeSidebarBtn')!
      .click();
  };

  credentials = () => {
    return this.user || null;
  };

  cancel = () => {
    this.windowService.nativeWindow.document
      .getElementById('closeLogoutModalBtn')!
      .click();
  };

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.applocal.currentUser.next(null);
    this.cancel();
    this.router.navigate(['/']);
  }

  viewProduct = (item: any) => {
    this.router.navigate([`/homepage/product/${item.id}`]);
    this.isSearch = false;
  };

  toggleSearch = () => {
    this.isSearch = !this.isSearch;
  };

  fetchCategories = () => {
    this.categoryService.GetCategory().subscribe((res) => {
      this.categories = res.data;
    });
  };

  getCustomerCart = () => {
    let cart$;
    const userId = this.user?.id ?? '';
    const reference = this.referenceId ?? '';

    cart$ = this.cartService.getCart(userId, reference);
    cart$
      .subscribe
      // (res) => {
      //   if (res.status === 'success') {
      //     this.cartCount = res.data.cartItems.length;
      //     console.log('api', this.cartCount);
      //   } else {
      //     this.toastService.warning(res.message, 'MESSAGE');
      //   }
      // },
      // (error) => {
      //   this.toastService.error(error.message, 'ERROR');
      // }
      ();
  };
}
