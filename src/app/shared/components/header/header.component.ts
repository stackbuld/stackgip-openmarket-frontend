import { getCartCount } from './../../../reducers/selectors/cart.selector';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';
import { getUser } from './../../../reducers/selectors/auth.selector';
import { IUser } from './../../../models/IUserModel';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers';
import { ICategory } from '../../../models/CategoryModels';
import { CategoryService } from '../../../services/category/category.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: false
})
export class HeaderComponent implements OnInit {
  user$: Observable<IUser>;
  cartCount$: Observable<number>;
  categories: ICategory[] = [];
  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private categoryService: CategoryService
  ) {
    this.categoryService.GetCategory().subscribe((a) => {
      this.categories = a.data;
    });
  }

  ngOnInit(): void {
    this.user$ = this.store.select(getUser);
    this.cartCount$ = this.store.select(getCartCount);
  }
  logout() {
    this.authService.Logout();
  }
}
