import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { IUser } from 'src/app/models/IUserModel';
import { AuthService } from 'src/app/services/auth.service';
import { ProductSearchService } from 'src/app/services/seller/product-search.service';
import { SellerService } from 'src/app/services/seller/seller.service';

@Component({
  selector: 'app-sidebar-header-display',
  templateUrl: './sidebar-header-display.component.html',
  styleUrls: ['./sidebar-header-display.component.css'],
})
export class SidebarHeaderDisplayComponent implements OnInit, AfterViewInit {
  currentRoute: string = 'seller/dashboard';
  userId: string;
  userProfilePicture: string;
  searchInput: FormControl;
  @ViewChild('search', { static: true }) searchQuery: ElementRef;
  isFetching: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sellerService: SellerService,
    private productSearchService: ProductSearchService
  ) {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? (this.currentRoute = event.url) : null;
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUser().id;
    this.userProfilePicture =
      localStorage.getItem('profilePicUrl') ||
      'assets/image/default-profile-picture-3.png';
    this.sellerService.getSeller(this.userId).subscribe({
      next: (data) => {
        this.userProfilePicture = data.data.profileImageUrl;
        localStorage.setItem('profilePicUrl', this.userProfilePicture);
      },
    });

    this.searchInput = new FormControl(null);

    this.searchInput.valueChanges.subscribe((value) => {
      if (value !== null) {
        this.productSearchService.isSearching.next(true);
      }
      if (value === '') {
        this.productSearchService.isSearching.next(false);
      }
    });
  }

  ngAfterViewInit(): void {
    this.getSearch();
  }

  getSearch() {
    fromEvent(this.searchQuery.nativeElement, 'keyup')
      .pipe(
        tap(() => {
          this.productSearchService.isFetching.next(true);
          console.log(true);
        }),
        filter(Boolean),
        debounceTime(300),
        distinctUntilChanged(),
        map((data) => this.searchQuery.nativeElement.value.toLowerCase()),
        switchMap((searchValue: any) => {
          return this.productSearchService.getProducts({
            userId: this.userId,
            search: searchValue,
          });
        })
      )
      .subscribe((res) => {
        this.productSearchService.isFetching.next(false);
        console.log(false);

        console.log(res);
      });
  }

  getProductSearchResult(query: string) {
    this.productSearchService
      .getProducts({ userId: this.userId, search: query })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
      });
  }
}
