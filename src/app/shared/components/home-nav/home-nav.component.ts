import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductsService } from 'src/app/services/products/products.service';
import algoliasearch from 'algoliasearch';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CartService } from '../../../services/cart/cart.service';
import { IUser } from 'src/app/models/IUserModel';
import { AuthService } from '../../../services/auth.service';
import { WindowRefService } from '../../services/window.service';
import { SearchService } from 'src/app/services/search/search.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutModalComponent } from '../logout-modal/logout-modal.component';

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
  seoDomain = environment.seoDomain;

  constructor(
    private categoryService: CategoryService,
    private appLocalStorage: AppLocalStorage,
    // private productService: ProductsService,
    private cartService: CartService,
    private toastService: ToastrService,
    private router: Router,
    private applocal: AppLocalStorage,
    private authService: AuthService,
    private windowService: WindowRefService,
    private searchService: SearchService,
    private dialog: MatDialog
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

    this.authService.isLogin.subscribe((status) => {
      if (!status) {
        this.cartCount = 0;
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

  onLogout() {
    this.dialog.open(LogoutModalComponent, {
      position: { top: '40px' },
    });
  }

  viewProduct = (item: any) => {
    this.router.navigate([`/homepage/product/${item.id}`]);
    this.isSearch = false;
  };

  toggleSearch = () => {
    this.isSearch = !this.isSearch;
  };

  fetchCategories = () => {
    this.categoryService.getAllStorefrontCategories().subscribe({
      next: (res) => {
        const categories = res
          .filter((cat, index) => {
            // this just a temporary fix. this category doesn't have ordering number and it's removed awaiting when it will totally be removed from the database, I have also requested for it to be removed by mujib on April 22 2024
            TODO: return cat.id !== 'e3393601-6453-4194-b5da-27ac8db5e92d';
          })
          .sort((a, b) => a.orderingNumber - b.orderingNumber);
        this.categories = categories;
      },
      error: (error) => {},
    });
  };
  getCustomerCart = () => {
    let cart$;
    const userId = this.user?.id ?? '';
    const reference = this.referenceId ?? '';

    cart$ = this.cartService.getCart(userId, reference);
    cart$.subscribe({
      next: (res) => {
        this.cartCount = res.data.cartItems.length;
      },
      error: (error) => {
        // this.toastService.error(error.message, 'ERROR');
      },
    });
  };
}
