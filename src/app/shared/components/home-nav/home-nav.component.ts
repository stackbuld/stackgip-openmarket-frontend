import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { CatgoryService } from 'src/app/services/category/catgory.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss']
})
export class HomeNavComponent implements OnInit {
  isSearch = false;
  categories: any;
  cartCount = 0;
  user: any;
  referenceId: any;

  constructor(
    private categoryService: CatgoryService,
    private appLocalStorage: AppLocalStorage,
    private productService: ProductsService,
    private toastService: ToastrService,
  ) {
    this.referenceId = localStorage.getItem('referenceId');
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {
    this.fetchCategories();
    if ((this.referenceId !== null) || this.user !== null) {
      this.getCustomerCart();
    }
    this.appLocalStorage.cartCount.subscribe(res => {
      if(res) {
        let it = res - 1;
        this.cartCount = (it === -1 ? 0 : it);
      } else {
        let it = (this.appLocalStorage.getFromStorage('cartCount') - 1);
        this.cartCount = (it === -1 ? 0 : it);
      }
    })
  }

  fetchCategories = () => {
    this.categoryService.GetCategory().subscribe((res) => {
      this.categories = res.data;
    });
  }

  getCustomerCart = () => {
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
          this.cartCount = res.data.cartItems.length;
        } 
        else {
          this.toastService.warning(res.message, 'MESSAGE')
        }
      }, (error) => {
        this.toastService.error(error.message, 'ERROR')
    });
  }

  toggleMobileSearchBar = () => {
    this.isSearch = !this.isSearch;
  }

}
